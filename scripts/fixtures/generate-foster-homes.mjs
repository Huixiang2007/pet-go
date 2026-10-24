import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '../..')
const outputDir = path.join(projectRoot, 'fixtures/foster-homes')
const center = { lat: 35.303, lng: 113.9268 }
const counts = [20, 100, 500]

function mulberry32(seed) {
  let value = seed
  return () => {
    value |= 0
    value = (value + 0x6d2b79f5) | 0
    let result = Math.imul(value ^ (value >>> 15), 1 | value)
    result = (result + Math.imul(result ^ (result >>> 7), 61 | result)) ^ result
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296
  }
}

const random = mulberry32(20261021)
const petOptions = ['猫', '狗', '兔', '鸟']
const records = Array.from({ length: 500 }, (_, index) => {
  const type = index % 3 === 0 ? '机构' : '个人'
  const angle = random() * Math.PI * 2
  const radiusMeters = Math.sqrt(random()) * 4500
  const lat = center.lat + (radiusMeters * Math.cos(angle)) / 111320
  const lng =
    center.lng +
    (radiusMeters * Math.sin(angle)) /
      (111320 * Math.cos((center.lat * Math.PI) / 180))
  const firstPet = petOptions[index % petOptions.length]
  const secondPet = petOptions[(index + 1) % petOptions.length]

  return {
    id: 100001 + index,
    name: `${type === '机构' ? '测试寄养机构' : '测试寄养家庭'}-${String(index + 1).padStart(3, '0')}`,
    cover: '',
    type,
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
    address: `河南省新乡市红旗区测试路${index + 1}号`,
    rating: Number((3 + random() * 2).toFixed(1)),
    reviewCount: 1 + Math.floor(random() * 5),
    price: 50 + Math.floor(random() * 151),
    petTypes: index % 2 === 0 ? [firstPet, secondPet] : [firstPet],
    distance: Number((radiusMeters / 1000).toFixed(2)),
  }
})

fs.mkdirSync(outputDir, { recursive: true })

for (const count of counts) {
  const content = `${JSON.stringify(records.slice(0, count), null, 2)}\n`
  const filePath = path.join(outputDir, `${count}.json`)
  fs.writeFileSync(filePath, content)
  const hash = crypto.createHash('sha256').update(content).digest('hex')
  console.log(`${path.relative(projectRoot, filePath)} count=${count} sha256=${hash}`)
}
