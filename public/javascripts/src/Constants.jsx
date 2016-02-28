/**
 * Sitewide constants, formats, etc.
 */

module.exports = {
  formats: {
    dates: {
      display: 'M/DD/YYYY',
      input: 'YYYY-MM-DD'
    },
    numbers: {
      currency: '$0,0',
      display: '0,0',
      percent: '0,0.00%'
    }
  },
  ajax: {
    validateResponse: function (resp) {
      if (resp.result == 'ERR') {
        if (resp.terminate) {
          // redirect the user if they are signed out
          alert(resp.message);
          window.location = '/';
        }
        return false;
      } else if (resp.result == 'OK') {
        return true;
      }
      return false;
    }
  },
  validateTransaction: function (t) {
    var errors = [];
    if (!t.name) {
      errors.push({prop: 'name', msg:'Invalid item name'});
    }
    if (!(t.price_listed > 0)) {
      errors.push({prop: 'price_listed', msg:'Invalid price listed'});
    }
    if (!(t.quantity > 0)) {
      errors.push({prop: 'quantity', msg:'Invalid quantity'});
    }
    if (!moment(t.date_listed).isValid()) {
      errors.push({prop: 'date_listed', msg:'Invalid list date'});
    }
    if (t.date_sold) {
      if (!moment(t.date_sold).isValid()) {
        errors.push({prop: 'date_sold', msg:'Invalid sold date'});
      }
    }
    if (t.price_sold) {
      if (!(t.price_sold > 0)) {
        errors.push({prop: 'price_sold', msg:'Invalid price sold'});
      }
    }
    if (errors.length > 0) {
      return errors;
    } else {
      return true;
    }
  }
};