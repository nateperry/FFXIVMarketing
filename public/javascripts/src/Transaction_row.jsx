/**
 * Display a Transaction as a table row
 */

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
        <td>{numeral(t.price_listed).format(Constants.formats.numbers.currency)}</td>
        <td>{numeral(t.quantity).format()}</td>
        <td className="calc">{numeral(total_sale_price).format(Constants.formats.numbers.currency)}</td>
        <td>{moment.unix(t.date_listed).format(Constants.formats.dates.display)}</td>
        <td>{moment.unix(t.date_sold).format(Constants.formats.dates.display)}</td>
        <td>{numeral(t.price_sold).format(Constants.formats.numbers.currency)}</td>
        <td className="calc">{numeral(tax_rate).format(Constants.formats.numbers.percent)}</td>
        <td className="calc">{numeral(tax_amount).format(Constants.formats.numbers.currency)}</td>
      </tr>
    )
  }
});