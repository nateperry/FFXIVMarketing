/**
 * Display a new Transaction form as a table row
 */

module.exports = React.createClass({
  componentDidMount: function () {
    console.log('mounting');
  },
  render: function () {
    return (
      <tr className="new-transaction">
        <td><input type="text" name="name" required /></td>
        <td><input type="text" name="price_listed" required /></td>
        <td><input type="text" name="quantity" required /></td>
        <td>&nbsp;</td>
        <td><input type="text" name="date_listed" className="date" defaultValue={moment().format(Constants.formats.dates.display)} required /></td>
        <td><input type="text" name="date_sold" className="date" /></td>
        <td><input type="text" name="price_sold" /></td>
        <td>&nbsp;</td>
        <td><button type="button" className="new-transaction-submit" onclick={this.submit}>+</button></td>
      </tr>
    )
  }
});