const promotions = require('./nb-promotions.json');
const categories = require('./nb-categories.json');
const appOffers = require('./app-offers.json');

module.exports = () => ({
  promotions: promotions,
  categories: categories,
  "app-offers": appOffers
  // address: const
});