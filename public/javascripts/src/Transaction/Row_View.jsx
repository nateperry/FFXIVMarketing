/**
 * Displays a static Transaction row
 */
module.exports = React.createClass({
  render: function () {
    var t = this.props.transaction;
    var total_sale_price = t.price_listed * t.quantity;
    var tax_amount = total_sale_price - t.price_sold;
    var tax_rate = (tax_amount) / total_sale_price;
    var sold = (t.price_sold > 0 && t.date_sold);
    return (
      <tr className={(sold)?'sold':''}>
        <td>
          <button type="button" className="button-edit" onClick={this.props.onEditClick}>
            <i className="fa fa-pencil"></i>
          </button>
        </td>
        <td className="align-left">{t.name}</td>
        <td>{t.high_quality?<i className="fa fa-check"></i>:''}</td>
        <td>{numeral(t.price_listed).format(Constants.formats.numbers.currency)}</td>
        <td>{numeral(t.quantity).format()}</td>
        <td className="calc">{numeral(total_sale_price).format(Constants.formats.numbers.currency)}</td>
        <td>{moment.unix(t.date_listed).format(Constants.formats.dates.display)}</td>
        <td>{t.date_sold?moment.unix(t.date_sold).format(Constants.formats.dates.display):''}</td>
        <td>{sold?numeral(t.price_sold).format(Constants.formats.numbers.currency):''}</td>
        <td className="calc">{sold?numeral(tax_rate).format(Constants.formats.numbers.percent):''}</td>
        <td className="calc">{sold?numeral(tax_amount).format(Constants.formats.numbers.currency):''}</td>
        <td className="col-delete">{<button type="button" className="button-delete" onClick={this.deleteRow}><i className="fa fa-times"></i></button>}</td>
      </tr>
    )
  }
});