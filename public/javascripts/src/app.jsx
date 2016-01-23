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

var Transactions = require('./Transactions.jsx');

ReactDOM.render(
  <Transactions />,
  document.getElementById('table-cta')
);

console.log('app initialized');