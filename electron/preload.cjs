'use strict';
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('adspDesktop',Object.freeze({
 read:()=>ipcRenderer.invoke('state:read'),
 write:text=>ipcRenderer.invoke('state:write',text),
 onClosing:callback=>{ipcRenderer.on('app:closing',()=>callback());},
 closeReady:()=>ipcRenderer.invoke('app:close-ready')
}));
