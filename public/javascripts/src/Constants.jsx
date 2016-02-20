/**
 * Sitewide constants, formats, etc.
 */

module.exports = {
  formats: {
    dates: {
      display: 'M/DD/YYYY'
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
          // redirect the user id they are signed out
          alert(resp.message);
          window.location = '/';
        }
        return false;
      } else if (resp.result == 'OK') {
        return true;
      }
      return false;
    }
  }
};