// electron-preload.js
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// We can use the contextBridge module to expose Node.js functionalities
// to the renderer process (your Svelte app) in a secure way.

// const { contextBridge, ipcRenderer } = require('electron');

// Example: Exposing a simple function
// contextBridge.exposeInMainWorld('myAPI', {
//   doSomething: () => ipcRenderer.invoke('do-something')
// });

console.log("Electron preload script loaded.");

// For now, we don't need to expose anything specific for the timer app.
// If we add features like saving data or native integrations,
// we would use contextBridge here.
