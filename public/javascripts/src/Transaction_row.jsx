/**
 * Display a Transaction as a table row
 */

var React = require('react');

module.exports = React.createClass({
  render: function () {
    var t = this.props.transaction;
    var total_sale_price = t.price_listed * t.quantity;
    var tax_amount = total_sale_price - t.price_sold;
    var tax_rate = (tax_amount) / total_sale_price;
    var sold = (t.price_sold > 0);
    return (
      <tr className={(sold)?'sold':''}>
        <td>{t.name}</td>
        <td>{t.price_listed}</td>
        <td>{t.quantity}</td>
        <td className="calc">{total_sale_price}</td>
        <td>{t.date_listed}</td>
        <td>{t.date_sold}</td>
        <td>{t.price_sold}</td>
        <td className="calc">{tax_rate * 100}%</td>
        <td className="calc">{tax_amount}</td>
      </tr>
    )
  }
});