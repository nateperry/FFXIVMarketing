/**
 * app.jsx
 *
 * @author Nate Perry
 * @created 1//22/2016
 */
React = require('react');
ReactDOM = require('react-dom');
Constants = require('./Constants.jsx');
moment = require('moment');
numeral = require('numeral');
numeral.defaultFormat(Constants.formats.numbers.display);

/**
 * Initialize sales table
 */
var salesTable = document.getElementById('table-sales-cta');
if (salesTable) {
  var Transactions = require('./Transactions.jsx');
  ReactDOM.render(
    <Transactions />,
    salesTable
  );
}

var userProfile = document.getElementById('user-profile-form-cta');
if (userProfile) {
  var Profile = require('./Profile.jsx');
  ReactDOM.render(
    <Profile />,
    userProfile
  );
  var Characters = require('./Profile_Characters.jsx');
  ReactDOM.render(
    <Characters />,
    document.getElementById('user-profile-form-characters-cta')
  );
}