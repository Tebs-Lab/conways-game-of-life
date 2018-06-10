/*
  Random bounded integer.
*/
function randomInteger(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

/*
  Random generation of many rulesets...
*/
function generateRuleSets() {
  let ruleSets = [];
  for(let underpopulation = 0; underpopulation < 9; underpopulation++) {
    for (let overpopulation = 0; overpopulation < 9; overpopulation++) {
      for (let reproductionMin = 0; reproductionMin < 9; reproductionMin++) {
        for (let reproductionMax = reproductionMin; reproductionMax < 9; reproductionMax++) {
          ruleSets.push([underpopulation, overpopulation, reproductionMin, reproductionMax]);
        }
      }
    }
  }

  return ruleSets;
}

/*
  This helper function makes binding the listeners cleaner
*/
function bindMultipleEventListener(element, eventNames, f) {
  eventNames.forEach((eventName) => {
    element.addEventListener(eventName, f);
  });
}
