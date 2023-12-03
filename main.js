const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(__dirname + "/pages/loading.html")
  // win.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("writefile", (event, file, data) => {
  console.log("in");
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);

  fs.writeFile(file, data, () => {
    console.log("success");
  });
});

ipcMain.handle("homedir", async() => {
  return await os.homedir()
})


ipcMain.handle('window-control', (event, control) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  switch (control) {
    case 'minimize':
      win.minimize();
      break;
    case 'maximize':
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
      break;
    case 'close':
      app.quit();
      break;
  }
});
