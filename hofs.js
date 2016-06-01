const vegetables = {
  { 
    type: "legume",
    weight: 1,
    color: "green",
    name: "green bean",
    growthRate: 1.3
  }, {
    type: "tuber",
    weight: 5,
    color: "brown",
    name: "potato",
    growthRate: 1.2
  }, {
    type: "leafy green",
    weight: 3,
    color: "green",
    name: "lettuce",
    growthRate: 2
  }
};

const getFilter = function (property, value) {
  return function (item) {
    return (item[property] === value);
  };
};

const buildModifier = function (modifiers) {
  return function (item) {
    var result = item;
    for mod in modifiers {
      result = item.map(mod);
    }
    return result
  };
};

const getModifier = function (multiplier) {
  return function (item) {
    item.weight * multiplier;
    return item;
  };
};

const seasonProjection = function (config) {
  return function (inventory) {
    var weeklyExternalities = buildModifier(config.externalities)
    var week = 0;
    var harvest = inventory;
    while week < config.weeks {
      harvest = inventory.map(function (item) {
        var itemGrowth = buildModifier([getModifier(item.growthRate), weeklyExternalities]);
        return itemGrowth(item);
      });
      week++;
    }
    return harvest;
  }
};

const pestilence = getModifier(0.85);
const drought = getModifier(0.97);
const goodSun = getModifier(1.5);

const seasonConfig = {
  weeks: 12,
  externalities: [
    pestilence,
    drought,
    goodSun,
  ]
};

// Projects the harvest over 12 weeks
var projectedHarvest = seasonProjection(seasonConfig)(inventory);
//
// Projects only the greens over 12 weeks
var projectedHarvest = seasonProjection(seasonConfig)(inventory.filter(getFilter("color", "green")));
