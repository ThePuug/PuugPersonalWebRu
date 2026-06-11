import fs from 'fs'
import path from 'path'

// Next's exporter writes its built-in not-found page to out/404/index.html,
// clobbering the app/(bg)/404 route. Our /bg/404/ render is the real 404 page;
// it becomes both /404/ and the Firebase miss handler 404.html.
const out = path.join(process.cwd(), 'out')
const src = path.join(out, 'bg', '404', 'index.html')
if (!fs.existsSync(src)) { console.error('postbuild: out/bg/404/index.html missing'); process.exit(1) }
fs.mkdirSync(path.join(out, '404'), { recursive: true })
fs.copyFileSync(src, path.join(out, '404', 'index.html'))
fs.copyFileSync(src, path.join(out, '404.html'))
