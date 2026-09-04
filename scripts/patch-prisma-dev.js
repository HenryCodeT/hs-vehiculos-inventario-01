const { readFileSync, writeFileSync, existsSync, readdirSync } = require('fs')
const { join } = require('path')

const pnpmDir = join(__dirname, '../node_modules/.pnpm')

function findStateCjs() {
  if (!existsSync(pnpmDir)) return null
  const entries = readdirSync(pnpmDir)
  const dir = entries.find((e) => e.startsWith('@prisma+dev@'))
  if (!dir) return null
  const file = join(pnpmDir, dir, 'node_modules/@prisma/dev/dist/state.cjs')
  return existsSync(file) ? file : null
}

const stateFile = findStateCjs()

if (!stateFile) {
  console.log('patch-prisma-dev: state.cjs not found, skipping')
  process.exit(0)
}

let content = readFileSync(stateFile, 'utf-8')

if (!content.includes('require("zeptomatch")')) {
  console.log('patch-prisma-dev: already patched')
  process.exit(0)
}

// Minimal inline glob matcher — replaces zeptomatch (ESM-only, incompatible with CJS require)
// IMPORTANT: use a function as the replacer to prevent $& and $' being interpreted by String.replace
const inlineMatcher =
  '{default:function(p,s){if(!p)return true;try{var re=new RegExp("^"+String(p).split("*").map(function(c){return c.replace(/[.+^${}()|[\\]\\\\]/g,"\\\\$&")}).join(".*")+"$");return re.test(s)}catch(e){return false}}}'

const patched = content.replace(
  /var ae=O\(require\("zeptomatch"\),\d+\)/,
  function () { return 'var ae=' + inlineMatcher },
)

if (patched === content) {
  console.log('patch-prisma-dev: pattern not found, skipping')
  process.exit(0)
}

writeFileSync(stateFile, patched, 'utf-8')
console.log('patch-prisma-dev: patched @prisma/dev successfully')
