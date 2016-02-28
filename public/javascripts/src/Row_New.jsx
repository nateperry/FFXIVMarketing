/**
 * Display a new Transaction form as a table row
 */

module.exports = React.createClass({
  _cta: null,
  componentDidMount: function () {
    var _self = this;
    var _cta = $(ReactDOM.findDOMNode(this));
    var $inputs = _cta.find('input');
    $inputs.on('focus', function () {
      $(this).removeClass('invalid')
    });
    $inputs.on('keypress', function (e) {
      if (e.which == 13) {
        _self.submit();
      }
    });
  },
  submit: function () {
    this.props.onSubmit();
  },
  render: function () {
    var t = this.props.transaction;
    var total_sale_price = t.price_listed * t.quantity;
    var tax_amount = total_sale_price - t.price_sold;
    var tax_rate = (tax_amount) / total_sale_price;
    var sold = (t.price_sold > 0 && t.date_sold);
    return (
      <tr className="new-transaction">
        <td colSpan="2">
          <input type="text" name="name" value={t.name} onChange={this.props.onChange} required />
          <input type="hidden" name="character_id" value={this.props.character_id} readOnly />
          <input type="hidden" name="retainer_id" value={this.props.retainer_id} readOnly />
        </td>
        <td><input type="checkbox" name="high_quality" checked={t.high_quality} onChange={this.props.onChange} /></td>
        <td><input type="text" name="price_listed" value={t.price_listed} onChange={this.props.onChange} required /></td>
        <td><input type="text" name="quantity" value={t.quantity} onChange={this.props.onChange} required /></td>
        <td className="calc">{numeral(total_sale_price).format(Constants.formats.numbers.currency)}</td>
        <td><input type="date" name="date_listed" className="date" value={t.date_listed?moment.unix(t.date_listed).format(Constants.formats.dates.input):''} onChange={this.props.onChange} required /></td>
        <td><input type="date" name="date_sold" className="date" value={t.date_sold?moment.unix(t.date_sold).format(Constants.formats.dates.input):''} onChange={this.props.onChange} /></td>
        <td><input type="text" name="price_sold" value={t.price_sold} onChange={this.props.onChange} /></td>
        <td className="calc">{sold?numeral(tax_rate).format(Constants.formats.numbers.percent):''}</td>
        <td className="calc">{sold?numeral(tax_amount).format(Constants.formats.numbers.currency):''}</td>
        <td className="col-action">
          <button type="button" className="button button-submit" onClick={this.submit}>
            <i className="fa fa-plus"></i>
          </button>
        </td>
      </tr>
    )
  }
});