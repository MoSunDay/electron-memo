const { app, BrowserWindow, Tray, Menu, Notification, powerMonitor, ipcMain } = require("electron");
const pkg = require("./package.json");
const path = require("path");
const moment = require("moment");
const dialog = require('electron').dialog;
const CronJob = require('cron').CronJob;


let win
let isQuitting = false
let heightReported = false

const WIN_W = 450
const WIN_MIN_H = 280
const WIN_MAX_H = 550

app.on('before-quit', () => {
  // Cmd+Q / 注销 / 系统退出流程：标记正在退出，放行窗口 close
  isQuitting = true
})

function createWindow() {
  heightReported = false
  win = new BrowserWindow({
    width: WIN_W,
    height: WIN_MIN_H,
    center: true,
    show: false, // 首帧隐藏，首次高度上报定尺寸后再显示
    // frame: false,
    useContentSize: true,
    autoHideMenuBar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (pkg.DEV) {
    win.loadURL("http://localhost:3000/");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "build/index.html"));
    console.log(`file://${path.join(__dirname, "build/index.html")}`);
  }

  // 兜底：渲染层始终未上报高度时（IPC 异常等），1s 后仍显示窗口；用户主动隐藏则取消
  let showFallback = setTimeout(() => {
    if (win && !win.isDestroyed() && !heightReported && !win.isVisible()) win.show()
  }, 1000)
  win.on('hide', () => {
    clearTimeout(showFallback)
  })

  var menuTemplate = [
    {
      label: '打开',
      click: () => {
        win.show();
      }
    },
    {
      label: '关闭',
      click: () => {
        win.hide();
      }
    },
    {
      label: '退出',
      click: () => {
        app.exit();
      }
    },
  ];

  let appIcon = new Tray(path.join(__dirname, "ico.png"));
  const contextMenu = Menu.buildFromTemplate(menuTemplate);
  appIcon.setToolTip('我的托盘图标');
  appIcon.setContextMenu(contextMenu);

  appIcon.on('double-click', (event) => {
    win.show();
  });

  appIcon.on('right-click', (event) => {
    appIcon.popUpContextMenu();
  });

  // 系统关机/重启：直接退出，避免阻塞关机（macOS/Linux）
  powerMonitor.on('shutdown', () => {
    isQuitting = true
    app.exit(0)
  })

  win.on('closed', () => {
    win = null
  })

  win.on('close', (event) => {
    if (isQuitting) {
      return
    }
    event.preventDefault();
    win.hide();
    // const {dialog, nativeImage} = require('electron')
    // dialog.showMessageBox({
    //   type: "info",
    //   title: "帮助",
    //   message: "close",
    //   buttons: ["确定", "取消"],
    //   incon: nativeImage.createFromPath("./ioc.png"),
    //   canceId: 2
    // }, function (index) {
    //   if (index == 2) {
    //     event.preventDefault();
    //     win.hide();
    //   } else {
    //     app.exit()
    //   }
    // })
  });

  function deadlineAlert() {
    const now = moment().unix();
    win.webContents
    .executeJavaScript('localStorage.getItem("todoList");', true)
    .then(result => {
      JSON.parse(result).map((todo) => {
        const deadline = todo.deadline;
        if (todo.completed === false && !deadline.startsWith("19")) {
          if (moment(deadline).unix() < now) {
            dialog.showErrorBox('Deadline 的事项已超时!', todo.content);
          } else if (moment(deadline).unix() - 10 * 60 < now) {
            const notify = new Notification({ title: "小小备忘录 - 提醒", body: `即将超时` })
            notify.show();
          }
        }
      });
    });
  };

  deadlineAlert();
  let job = new CronJob('*/1 * * * *', () => {
    console.log(`${moment().format()} cron job`);
    deadlineAlert();
  });
  job.start();
}

// 渲染层上报内容自然高度：窗口高度自适应，上限为原 550，下限 280
ipcMain.on('memo-content-height', (_e, h) => {
  if (!win || !Number.isFinite(h)) return
  const target = Math.max(WIN_MIN_H, Math.min(WIN_MAX_H, Math.round(h)))
  if (!heightReported) {
    // 首次上报：先按内容定尺寸并居中再显示，消除启动 280→目标高度的可见跳变
    heightReported = true
    win.setContentSize(WIN_W, target)
    win.center()
    if (!win.isVisible()) win.show()
    return
  }
  const [curW, curH] = win.getContentSize()
  if (curW === WIN_W && curH === target) return
  win.setContentSize(WIN_W, target)
})

app.on('ready', createWindow);

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});