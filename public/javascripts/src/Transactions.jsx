var Transaction_row = require('./Transaction_row.jsx');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      transactions: JSON.parse(document.getElementById('initial-trans').innerHTML)
    };
  },
  componentDidMount: function () {
    console.log(this.state);
    var self = this;
    //$(window).on('keypress', function (e) {
    //  // TODO: hook up key bindings, consider using keyhandler class
    //  console.log('key pressed:' + e.which + ' = ' + self.keyMap[e.which]);
    //});
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
        </tr>
        </thead>
        <tbody>
        {this.state.transactions.map(function (row, index) {
          return <Transaction_row transaction={row} key={index} />;
        })}
        </tbody>
      </table>
    );
  },
  keyMap: {
    '13': 'enter',
    '32': 'pauseAll',
    // 0 - 9
    '48':'',
    '49':'',
    '50':'',
    '51':'',
    '52':'',
    '53':'',
    '54':'',
    '55':'',
    '56':'',
    '57':'',
    // a-z
    '97':'',
    '98':'',
    '99':'',
    '100':'',
    '101':'',
    '102':'',
    '103':'',
    '104':'',
    '105':'',
    '106':'',
    '107':'',
    '108':'',
    '109':'',
    '110':'',
    '111':'',
    '112':'',
    '113':'',
    '114':'',
    '115':'',
    '116':'',
    '117':'',
    '118':'',
    '119':'',
    '120':'',
    '121':'',
    '122':''
  }
});