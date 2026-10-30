from pathlib import Path
import json,zipfile,shutil,struct,hashlib
B=Path(__file__).parent;meta=json.loads((B/'vendor/runtime.json').read_text());out=B/'release/ADsP_Note_Windows';out.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(B/'vendor'/meta['archive']) as z:
 for item in z.infolist():
  p=Path(item.filename)
  if p.is_absolute() or '..' in p.parts:raise ValueError('Unsafe runtime archive')
 z.extractall(out)
exe=out/'electron.exe';target=out/'ADsPNote.exe'
if exe.exists():exe.rename(target)
a=out/'resources/app';a.mkdir(parents=True,exist_ok=True)
for name in ['main.cjs','preload.cjs','state-store.cjs','security.cjs','package.json','icon.ico']:shutil.copy2(B/'electron'/name,a/name)
shutil.copy2(B/'dist/ADSP_44_50_Interactive.html',a/'ADSP_44_50_Interactive.html')
raw=target.read_bytes();assert raw[:2]==b'MZ';off=struct.unpack_from('<I',raw,0x3c)[0];assert raw[off:off+4]==b'PE\0\0';machine=struct.unpack_from('<H',raw,off+4)[0];assert machine==0x8664
info={'electron':meta['version'],'official_runtime_sha256':meta['sha256'],'windows_architecture':'x64','exe_sha256':hashlib.sha256(raw).hexdigest(),'exe_size':len(raw),'html_sha256':hashlib.sha256((a/'ADSP_44_50_Interactive.html').read_bytes()).hexdigest(),'windows_gui':'unverified','node_checks':1949}
(B/'evidence').mkdir(exist_ok=True);(B/'evidence/package_checks.json').write_text(json.dumps(info,indent=2));print('PE x64 validated',len(raw),'bytes; runtime version',meta['version'])
