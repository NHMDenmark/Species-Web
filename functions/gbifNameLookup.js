export default async function gbifNameLookup(name, rank) {
    const response = await fetch(`https://api.gbif.org/v1/species?name=${name}&rank=${rank}&limit=1`);
    const data = await response.json();

    if (data.results.length === 0) {
        return null;
    } else {
        const result = data.results[0];
        if (['species', 'variety', 'subsp'].includes(rank.toLowerCase())) {
            if (!(result.species??false) && result.canonicalName) {
                result.species = result.canonicalName;
            }
            if (result.species) {
                result.species = result.species.replace(/\u00d7/g, 'x');
            }
            if (result.canonicalName) {
                result.canonicalName = result.canonicalName.replace(/\u00d7/g, 'x');
            }
            if (result.species && !result.genus) {
                result.genus = result.species.split(' ')[0];
            }
            if (result.species && !result.canonicalName) {
                result.canonicalName = result.species;
            }
            if (rank.toLowerCase() === "variety" && result.canonicalName) {
                result.variety = result.canonicalName.split(' ')[2];
                result.species = result.canonicalName.split(' ').slice(0, 2).join(' ');
            }
        }
        return result;
    }
}
