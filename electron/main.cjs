'use strict';
const {app,BrowserWindow,ipcMain,Menu,dialog,shell,session}=require('electron');
const path=require('node:path'),{pathToFileURL}=require('node:url');
const {createStore}=require('./state-store.cjs'),{allowedExternal,authorized}=require('./security.cjs');
app.setName('ADsP Note');app.setPath('userData',path.join(app.getPath('appData'),'ADsPNote'));
const htmlPath=path.join(__dirname,'ADSP_44_50_Interactive.html'),htmlURL=pathToFileURL(htmlPath).href;
let win,store,closing=false,closeTimer;
if(!app.requestSingleInstanceLock()){app.quit();}else{
 app.on('second-instance',()=>{if(win){if(win.isMinimized())win.restore();win.show();win.focus();}});
 app.whenReady().then(()=>{
  store=createStore(app.getPath('userData'));Menu.setApplicationMenu(null);
  session.defaultSession.setPermissionRequestHandler((_w,_p,cb)=>cb(false));
  session.defaultSession.webRequest.onBeforeRequest({urls:['http://*/*','https://*/*']},(_d,cb)=>cb({cancel:true}));
  ipcMain.handle('state:read',e=>{if(!authorized(e,win,htmlURL))throw Error('요청이 허용되지 않습니다.');return store.read();});
  ipcMain.handle('state:write',(e,text)=>{if(!authorized(e,win,htmlURL))throw Error('요청이 허용되지 않습니다.');return store.write(text);});
  ipcMain.handle('app:close-ready',async e=>{if(!authorized(e,win,htmlURL))throw Error('요청이 허용되지 않습니다.');await store.flush();closing=true;clearTimeout(closeTimer);win.close();});
  win=new BrowserWindow({width:1280,height:900,minWidth:430,minHeight:600,title:'ADsP 노트',backgroundColor:'#f4f6f8',icon:path.join(__dirname,'icon.ico'),show:false,webPreferences:{preload:path.join(__dirname,'preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true,devTools:false}});
  win.webContents.setWindowOpenHandler(({url})=>{if(allowedExternal(url))shell.openExternal(url).catch(()=>{});return {action:'deny'};});
  win.webContents.on('will-navigate',(e,url)=>{if(url!==htmlURL){e.preventDefault();if(allowedExternal(url))shell.openExternal(url).catch(()=>{});}});
  win.webContents.on('will-attach-webview',e=>e.preventDefault());
  win.once('ready-to-show',()=>win.show());
  win.on('close',e=>{if(closing)return;e.preventDefault();win.webContents.send('app:closing');closeTimer=setTimeout(async()=>{try{await store.flush();}catch{}closing=true;win.close();},3000);});
  win.on('closed',()=>{win=null;});
  win.loadFile(htmlPath).catch(()=>{dialog.showErrorBox('ADsP 노트 실행 실패','교재 파일을 열지 못했습니다. ZIP 전체를 새 폴더에 압축 해제한 후 실행하세요.');closing=true;app.quit();});
 }).catch(e=>{dialog.showErrorBox('ADsP 노트 실행 실패',String(e.message));app.quit();});
 app.on('window-all-closed',()=>app.quit());
}
