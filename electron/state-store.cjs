'use strict';
const fs=require('node:fs/promises'),path=require('node:path');
function validateText(text){if(typeof text!=='string'||Buffer.byteLength(text)>8e6)throw Error('8MB 이하 기록만 저장할 수 있습니다.');const x=JSON.parse(text);if(x.schema!==2||x.dataset!=='44-50-v1'||!Array.isArray(x.sessions)||x.sessions.length+(x.archivedSessions?.length||0)>3000)throw Error('지원하지 않는 기록입니다.');return text;}
function createStore(directory){const file=path.join(directory,'learning-state.json');let queue=Promise.resolve();return {
 async read(){try{const text=await fs.readFile(file,'utf8');validateText(text);return {text};}catch(e){if(e.code==='ENOENT')return {text:null};return {error:'read-failed'};}},
 write(text){try{validateText(text);}catch(e){return Promise.reject(e);}queue=queue.catch(()=>{}).then(async()=>{await fs.mkdir(directory,{recursive:true});let old;try{old=await fs.readFile(file,'utf8');}catch(e){if(e.code!=='ENOENT')throw e;}if(old!==undefined){let valid=true;try{validateText(old);}catch{valid=false;}await fs.copyFile(file,valid?file+'.prev':file+'.corrupt-'+Date.now());}const tmp=file+'.tmp';let handle;try{handle=await fs.open(tmp,'w',0o600);await handle.writeFile(text,'utf8');await handle.sync();await handle.close();handle=null;await fs.rename(tmp,file);}finally{if(handle)await handle.close();}return {ok:true};});return queue;},
 flush(){return queue;}
};}
module.exports={createStore,validateText};
