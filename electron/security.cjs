'use strict';
const allowedHosts=new Set(['csrc.nist.gov','www.itl.nist.gov','online.stat.psu.edu','docs.oracle.com','docs.scipy.org','cmmiinstitute.com']);
function allowedExternal(raw){try{const u=new URL(raw);return u.protocol==='https:'&&allowedHosts.has(u.hostname)&&!u.username&&!u.password;}catch{return false;}}
function authorized(event,win,url){return !!win&&!win.isDestroyed()&&event.sender===win.webContents&&event.senderFrame===win.webContents.mainFrame&&event.senderFrame?.url===url;}
module.exports={allowedExternal,authorized};
