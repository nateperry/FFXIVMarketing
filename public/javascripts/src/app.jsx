/**
 * app.jsx
 *
 * @author Nate Perry
 * @created 1//22/2016
 */

var React = require('react'), ReactDOM = require('react-dom');

var Transactions = require('./Transactions.jsx');

ReactDOM.render(
  <Transactions />,
  document.getElementById('table-cta')
);

console.log('app initialized');