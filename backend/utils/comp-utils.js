import Recipe from '../models/Recipe.js';

async function findExistingComp(compName) {
  const existingComp = await Recipe.findOne({ 'comps.name': compName }, { 'comps.$': 1 });

  if (existingComp) {
    console.log(`Comp ${compName} found in database`);
    return existingComp.comps[0].nutrients;
  }

  return null;
}

export default findExistingComp;
