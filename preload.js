const { contextBridge, ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

contextBridge.exposeInMainWorld("electronAPI", {
  writeFile: (file, data) => ipcRenderer.invoke("writefile", file, data),
  loadNewFile: (file) => ipcRenderer.invoke("load-new-page", file),
  windowControl: (control) => ipcRenderer.invoke("window-control", control),
  homeDir: () => ipcRenderer.invoke("homedir")
});
