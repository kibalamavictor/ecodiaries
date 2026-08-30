import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { gzipSync } from 'node:zlib'

const nextStaticDirectory = join(process.cwd(), '.next', 'static')
const chunksDirectory = join(nextStaticDirectory, 'chunks')
const cssDirectory = join(nextStaticDirectory, 'css')

function filesIn(directory, extension) {
  if (!existsSync(directory)) return []

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return filesIn(path, extension)
    return entry.name.endsWith(extension) ? [path] : []
  })
}

function gzipSize(file) {
  return gzipSync(readFileSync(file)).byteLength
}

function kilobytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`
}

if (!existsSync(nextStaticDirectory)) {
  console.error('No .next/static directory found. Run npm run build before checking the bundle budget.')
  process.exit(1)
}

const jsChunks = filesIn(chunksDirectory, '.js')
  .map((file) => ({ file, gzipBytes: gzipSize(file) }))
  .filter(({ file }) => {
    const chunkPath = relative(nextStaticDirectory, file).replaceAll('\\', '/')
    return !chunkPath.includes('polyfills') && !chunkPath.includes('payload/admin')
  })

const cssFiles = filesIn(cssDirectory, '.css').map((file) => ({ file, gzipBytes: gzipSize(file) }))
const totalCssGzipBytes = cssFiles.reduce((total, { gzipBytes }) => total + gzipBytes, 0)
const oversizedChunks = jsChunks.filter(({ gzipBytes }) => gzipBytes > 300 * 1024)
const homepageChunks = jsChunks.filter(({ file }) => {
  const chunkPath = relative(nextStaticDirectory, file).replaceAll('\\', '/')
  return (
    chunkPath.includes('app/(frontend)/layout-') ||
    chunkPath.includes('app/(frontend)/page-')
  )
})

console.table([
  {
    metric: 'JavaScript chunks',
    gzip: kilobytes(jsChunks.reduce((total, { gzipBytes }) => total + gzipBytes, 0)),
    files: jsChunks.length,
  },
  {
    metric: 'Total CSS',
    gzip: kilobytes(totalCssGzipBytes),
    files: cssFiles.length,
  },
])

console.log('Homepage-relevant app chunk sizes (gzip):')
console.table(
  homepageChunks.map(({ file, gzipBytes }) => ({
    chunk: relative(nextStaticDirectory, file),
    gzip: kilobytes(gzipBytes),
  })),
)

for (const { file, gzipBytes } of oversizedChunks) {
  console.warn(
    `Bundle budget warning: ${relative(nextStaticDirectory, file)} is ${kilobytes(gzipBytes)} gzip (limit: 300 KB).`,
  )
}

if (totalCssGzipBytes > 180 * 1024) {
  console.warn(
    `Bundle budget warning: total CSS is ${kilobytes(totalCssGzipBytes)} gzip (limit: 180 KB).`,
  )
}
