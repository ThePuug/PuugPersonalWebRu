import fs from 'fs'
import path from 'path'
const root = process.cwd()
const pub = path.join(root, 'public')
fs.rmSync(pub, { recursive: true, force: true })
fs.mkdirSync(path.join(pub, 'icons'), { recursive: true })
fs.cpSync(path.join(root, 'src', 'images'), path.join(pub, 'images'), { recursive: true })
for (const s of [48, 72, 96, 144, 192, 256, 384, 512])
  fs.copyFileSync(path.join(root, 'src', 'icons', `icon-${s}x${s}.png`), path.join(pub, 'icons', `icon-${s}x${s}.png`))
fs.copyFileSync(path.join(root, 'src', 'icons', 'favicon-32x32.png'), path.join(pub, 'favicon-32x32.png'))
fs.copyFileSync(path.join(root, 'src', 'manifest.webmanifest'), path.join(pub, 'manifest.webmanifest'))
