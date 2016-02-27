var Transaction_row = require('./Transaction_row.jsx');
var Transaction_new_row = require('./Transaction_new_row.jsx');

module.exports = React.createClass({
  getInitialState: function () {
    // set initial application state
    var charCode = JSON.parse(document.getElementById('character-code').innerHTML) || {};
    return {
      transactions: JSON.parse(document.getElementById('initial-trans').innerHTML) || [],
      owner: charCode
    };
  },
  onUpdate: function (transactions) {
    if (transactions) {
      this.setState({transactions: transactions});
    } else {
      this.setState(this.state);
    }
  },
  render: function() {
    var _self = this;
    return (
      <table>
        <thead>
        <tr>
          <th colSpan="2">Item</th>
          <th>HQ</th>
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
            return <Transaction_row transaction={row} onUpdate={_self.onUpdate} key={index} />;
          })}
          <Transaction_new_row owner={this.state.owner} onUpdate={this.onUpdate} />
        </tbody>
      </table>
    );
  }
});