/**
 * Display a new Transaction form as a table row
 */

module.exports = React.createClass({
  _cta: null,
  componentDidMount: function () {
    var _self = this;
    this._cta = $('.new-transaction');

    var inputs = this._cta.find('input');
    inputs.on('focus', function () {
      $(this).removeClass('invalid')
    });

    inputs.on('keypress', function (e) {
      if (e.which == 13) {
        _self.submit();
      }
    });

    this._cta.find('.new-transaction-submit').on('click', function (e) {
      _self.submit();
    });
  },
  submit: function () {
    var obj = {};
    var _invalid = false;
    $('.new-transaction').find('input').each(function () {
      var $input = $(this);
      var val = $input.val().trim();
      if ($input.prop('required') && val == '') {
        _invalid = true;
        $input.addClass('invalid');
        return;
      }
      obj[$input.attr('name')] = val;
    });

    if (_invalid) {
      this._cta.find('input.invalid').first().focus();
      alert('Missing a required field!');
      return false;
    }

    $.ajax({
      url: '/api/insert',
      dataType: 'json',
      data: obj,
      success: function (resp) {
        console.log(resp);
      },
      error: function () {
        alert('An error occurred and your entry was not added');
      },
      complete: function () {
        // TODO: hide ajax
      }
    })

  },
  render: function () {
    return (
      <tr className="new-transaction">
        <td><input type="text" name="name" required /></td>
        <td><input type="text" name="price_listed" required /></td>
        <td><input type="text" name="quantity" required /></td>
        <td>&nbsp;</td>
        <td><input type="text" name="date_listed" defaultValue={moment().format(Constants.formats.dates.display)} required /></td>
        <td><input type="text" name="date_sold" /></td>
        <td><input type="text" name="price_sold" /></td>
        <td>&nbsp;</td>
        <td><button type="button" className="new-transaction-submit">+</button></td>
      </tr>
    )
  }
});