var Transaction_row = require('./Transaction_row.jsx');

module.exports = React.createClass({
  getInitialState: function () {
    // set initial application state
    return {
      transactions: JSON.parse(document.getElementById('initial-trans').innerHTML) || [],
      owner: JSON.parse(document.getElementById('character-code').innerHTML) || {},
      newTransaction: this.getBaseTransaction()
    };
  },
  getBaseTransaction: function () {
    var owner = JSON.parse(document.getElementById('character-code').innerHTML);
    return {
      name: '',
      price_listed: '',
      quantity: '',
      high_quality: false,
      date_listed: moment().unix(),
      date_sold: '',
      price_sold: '',
      character_id: owner.character_id,
      retainer_id: owner.retainer_id
    }
  },
  resetTransaction: function (trans, original) {
    console.log('resetting');
    var index = this.state.transactions.findIndex(function (t) {
      return t._id == trans._id;
    });
    this.state.transactions[index] = original;
    this.setState({transactions: this.state.transactions});
  },
  onUpdate: function (transactions) {
    if (transactions) {
      this.setState({transactions: transactions, newTransaction: this.getBaseTransaction()});
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
            <th className="align-left">List Date</th>
            <th className="align-left">Sell Date</th>
            <th>Sell Price</th>
            <th className="tax">Tax Rate</th>
            <th>Tax Paid</th>
            <th className="col-delete">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <Transaction_row isNew={true} transaction={this.state.newTransaction} owner={this.state.owner} onUpdate={this.onUpdate} key={moment().unix()} />
          {this.state.transactions.map(function (row, index) {
            return <Transaction_row transaction={row} owner={_self.state.owner} onUpdate={_self.onUpdate} onCancel={_self.resetTransaction} key={index} />;
          })}
        </tbody>
      </table>
    );
  }
});