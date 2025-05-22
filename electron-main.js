const { app, BrowserWindow } = require("electron");
const path = require("node:path");

// Determine if running in development or production
const isDev = process.env.NODE_ENV !== "production";

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, "electron-preload.js"), // We'll create this later if needed for IPC
      contextIsolation: true, // Recommended for security
      nodeIntegration: false, // Recommended for security
    },
  });

  // Load the Svelte app
  if (isDev) {
    // In development, load from the Vite dev server
    // Ensure your Vite dev server is running on port 5173 (default)
    mainWindow.loadURL("http://localhost:5173");
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));
  }

  // Optional: Remove menu bar for a cleaner look for a small app
  mainWindow.setMenuBarVisibility(false);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
