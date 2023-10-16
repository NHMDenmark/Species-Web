const saturationRange = [85, 100]
const lightnessRange = [20, 40]

const getHashOfString = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    // tslint:disable-next-line: no-bitwise
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  hash = Math.abs(hash)
  return hash
}

const normalizeHash = (hash, min, max) => {
  return Math.floor((hash % (max - min)) + min)
}

const generateHSL = (str) => {
  const hash = getHashOfString(str)
  const h = normalizeHash(hash, 0, 360)
  const s = normalizeHash(hash, saturationRange[0], saturationRange[1])
  const l = normalizeHash(hash, lightnessRange[0], lightnessRange[1])
  return [h, s, l]
}

const HSLtoString = (hsl) => {
  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`
}

const stringToColor = (str) => {
  return HSLtoString(generateHSL(str))
}

export default stringToColor