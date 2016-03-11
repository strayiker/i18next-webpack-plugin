
var resources = {
  de: require('./de.json')
}

var languages = {
  basic: {
    lng: 'basic',
    fallbackLng: false,
    keySeparator: false,
    nsSeparator: false,
    resources: resources
  },
  de: {
    lng: 'de',
    fallbackLng: 'basic',
    keySeparator: false,
    nsSeparator: false,
    resources: resources,
    saveMissing: true
  }
};


module.exports = languages;
