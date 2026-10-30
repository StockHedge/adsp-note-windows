from pathlib import Path
import json,urllib.request,hashlib
b=Path(__file__).parent;p=b/'runtime.json'
if not p.exists():p=b/'vendor/runtime.json'
m=json.loads(p.read_text());v=b/'vendor';v.mkdir(exist_ok=True);out=v/m['archive']
with urllib.request.urlopen(m['source'],timeout=60) as r,out.open('wb') as f:
 while True:
  c=r.read(1024*1024)
  if not c:break
  f.write(c)
if hashlib.sha256(out.read_bytes()).hexdigest()!=m['sha256']:raise ValueError('Runtime checksum mismatch')
(v/'runtime.json').write_text(json.dumps(m,indent=2));print('Official runtime checksum verified')
