/**
 * Display a Transaction as a table row
 */

module.exports = React.createClass({
  deleteRow: function () {
    var state = this.getInitialState();
    console.log(state);
    var _self = this;
    $.ajax({
      url: '/api/delete',
      dataType: 'json',
      data: {
        id: state.id
      },
      method: 'POST',
      success: function (resp) {
        if (Constants.ajax.validateResponse(resp)) {
          _self.setState(_self.getInitialState());
          _self.props.onUpdate(resp.transactions);
          return;
        }
        alert('An error occurred and your entry was not deleted.');
      },
      error: function () {
        alert('An error occurred and your entry was not deleted.');
      },
      complete: function () {
        // TODO: hide ajaxclassName="date"
      }
    });
  },
  getInitialState: function () {
    return {id: this.props.transaction._id}
  },
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
        <td>{t.date_sold?moment.unix(t.date_sold).format(Constants.formats.dates.display):''}</td>
        <td>{sold?numeral(t.price_sold).format(Constants.formats.numbers.currency):''}</td>
        <td className="calc">{sold?numeral(tax_rate).format(Constants.formats.numbers.percent):''}</td>
        <td className="calc">{sold?numeral(tax_amount).format(Constants.formats.numbers.currency):''}</td>
        <td className="col-delete">{sold?'':<button type="button" onClick={this.deleteRow}>X</button>}</td>
      </tr>
    )
  }
});