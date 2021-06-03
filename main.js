const { app, BrowserWindow } = require("electron");
const pkg = require("./package.json"); // 引用package.json
const path = require("path");
const moment = require("moment");
const dialog = require('electron').dialog;


function createWindow() {
  const win = new BrowserWindow({
    width: 450,
    height: 550,
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

  const now = moment();
  function deadlineAlert() {
    win.webContents
    .executeJavaScript('localStorage.getItem("todoList");', true)
    .then(result => {
      JSON.parse(result).map((todo) => {
        const deadline = todo.deadline;
        if (todo.completed === false && !deadline.startsWith("19") && moment(deadline) < now) {
          dialog.showErrorBox('Deadline 的事项已超时!', todo.content);
        }
      });
    });
  }
  deadlineAlert();
  setInterval(deadlineAlert, 1000 * 60 * 5);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  app.quit();
});

app.on('close', (event) => {
  event.preventDefault()
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});