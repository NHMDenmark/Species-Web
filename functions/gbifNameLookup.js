export default async function gbifNameLookup(name, rank) {
  const response = await fetch(`https://api.gbif.org/v1/species?name=${name}&rank=${rank}&limit=3`)
  const data = await response.json()

  if (!(data && data.results && data.results.length > 0)) {
    return null
  } else {
    const result = data.results.find((x) => x.kingdom.toLowerCase() === 'plantae')
    if (!result) return null
    if (['species', 'variety', 'subspecies'].includes(rank.toLowerCase())) {
      if (!(result.species ?? false) && result.canonicalName) {
        result.species = result.canonicalName
      }
      if (result.species) {
        result.species = result.species.replace(/\u00d7/g, 'x')
      }
      if (result.canonicalName) {
        result.canonicalName = result.canonicalName.replace(/\u00d7/g, 'x')
      }
      if (result.species && !result.genus) {
        result.genus = result.species.split(' ')[0]
      }
      if (result.species && !result.canonicalName) {
        result.canonicalName = result.species
      }
      if (
        rank.toLowerCase() === 'variety' &&
        result.canonicalName &&
        result.canonicalName.split(' ').length > 2
      ) {
        result.variety = result.canonicalName.split(' ')[2]
        result.species = result.canonicalName.split(' ').slice(0, 2).join(' ')
      }
      if (
        rank.toLowerCase() === 'subspecies' &&
        result.canonicalName &&
        result.canonicalName.split(' ').length > 2
      ) {
        result.subsp = result.canonicalName.split(' ')[2]
        result.species = result.canonicalName.split(' ').slice(0, 2).join(' ')
      }
      if (
        result.taxonomicStatus &&
        result.taxonomicStatus.toLowerCase() === 'synonym' &&
        result.accepted &&
        result.accepted.split(' ').length > 2
      ) {
        if (result.accepted.split(' ')[2] === 'var.') {
          result.variety = result.accepted.split(' ')[3]
        } else {
          result.subsp = result.accepted.split(' ')[3]
        }
      }
    }
    return result
  }
}
