var Transaction_row = require('./Transaction_row.jsx');
var Transaction_new_row = require('./Transaction_new_row.jsx');

module.exports = React.createClass({
  getInitialState: function () {
    // set initial application state
    return {
      transactions: JSON.parse(document.getElementById('initial-trans').innerHTML) || []
    };
  },
  onUpdate: function (transactions) {
    this.setState({transactions: transactions});
  },
  render: function() {
    return (
      <table>
        <thead>
        <tr>
          <th>Item</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Sale Price</th>
          <th>List Date</th>
          <th>Sell Date</th>
          <th>Sell Price</th>
          <th className="tax">Tax Rate</th>
          <th>Tax Paid</th>
          <th className="col-delete">&nbsp;</th>
        </tr>
        </thead>
        <tbody>
        {this.state.transactions.map(function (row, index) {
          return <Transaction_row transaction={row} key={index} />;
        })}
        <Transaction_new_row onUpdate={this.onUpdate} />
        </tbody>
      </table>
    );
  }
});