const { app, BrowserWindow } = require("electron");
const pkg = require("./package.json"); // 引用package.json
const path = require("path");

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
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
