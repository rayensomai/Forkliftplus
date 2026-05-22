import fs from 'fs'
import os from 'os'
import path from 'path'

const pages = ['fp-manual.html', 'fp-manual-p2.html'].map((f) =>
  fs.existsSync(path.join(os.tmpdir(), f)) ? fs.readFileSync(path.join(os.tmpdir(), f), 'utf8') : ''
)
const html = pages.join('\n')
const re = /<li class="product type-product[\s\S]*?<\/li>/g
const out = []
let m
while ((m = re.exec(html))) {
  const b = m[0]
  const title = b
    .match(/<h3 class="product-title">[\s\S]*?<a[^>]*>[\s\S]*?([^<]+)</)?.[1]
    ?.replace(/&#215;/g, '×')
    ?.trim()
  const img =
    b.match(/data-orig-src="(https:\/\/www\.forkliftplus\.com\/wp-content\/uploads\/[^"]+)"/)?.[1] ||
    b.match(/src="(https:\/\/www\.forkliftplus\.com\/wp-content\/uploads\/[^"]+\.(?:jpg|png|webp))"/)?.[1]
  const link =
    b.match(/class="product-images"[^>]*href="([^"]+)"/)?.[1] ||
    b.match(/<h3 class="product-title">[\s\S]*?href="([^"]+)"/)?.[1]
  const ins = b.match(/<ins[^>]*>[\s\S]*?bdi>[\s\S]*?([\d,.]+)</)
  const regular = b.match(/<span class="price">[\s\S]*?bdi>[\s\S]*?([\d,.]+)</)
  const price = ins?.[1] || regular?.[1] || ''
  const sale = /<span class="onsale">/.test(b)
  if (title) out.push({ title, price, img, link, sale })
}
console.log(JSON.stringify(out, null, 2))
