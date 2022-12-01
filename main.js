const { app, BrowserWindow, Tray, Menu, Notification } = require("electron");
const pkg = require("./package.json"); // 引用package.json
const path = require("path");
const moment = require("moment");
const dialog = require('electron').dialog;

let win
function createWindow() {
  win = new BrowserWindow({
    width: 450,
    height: 550,
    center: true,
    // frame: false,
    useContentSize: true,
    autoHideMenuBar: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (pkg.DEV) {
    win.loadURL("http://localhost:3000/");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "build/index.html"));
    console.log(`file://${path.join(__dirname, "build/index.html")}`);
  }

  if (process.platform === 'linux') {
    var menuTemplate = [
      {
        label: '退出',
        click: () => {
          app.exit();
        }
      },
      {
        label: '打开',
        click: () => {
          win.show();
        }
      },
    ];
  } else {
    var menuTemplate = [
    ];
  }

  let appIcon = new Tray(path.join(__dirname, "ico.png"));
  const contextMenu = Menu.buildFromTemplate(menuTemplate);
  appIcon.setToolTip('我的托盘图标');
  appIcon.setContextMenu(contextMenu);

  appIcon.on('click', () => {
    win.show();
  });

  appIcon.on('right-click', () => {
    appIcon.popUpContextMenu();
  });

  win.on('close', (event) => {
    event.preventDefault();
    win.hide();
  });

  const now = moment().unix();
  function deadlineAlert() {
    win.webContents
    .executeJavaScript('localStorage.getItem("todoList");', true)
    .then(result => {
      JSON.parse(result).map((todo) => {
        const deadline = todo.deadline;
        if (todo.completed === false && !deadline.startsWith("19")) {
          if (moment(deadline).unix() < now) {
            dialog.showErrorBox('Deadline 的事项已超时!', todo.content);
          }
          if (moment(deadline).unix() - 10 * 60 < now) {
            const notify = new Notification({ title: "小小备忘录 - 提醒", body: `即将超时` })
            notify.show();
          }
        }
      });
    });
  }

  deadlineAlert();
  setInterval(deadlineAlert, 1000 * 60 * 5);
}

app.on('ready', createWindow);

app.on('closed', () => {
  win = null;
});

app.on('close', (event) => {
  app.exit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});