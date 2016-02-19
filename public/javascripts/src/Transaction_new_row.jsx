/**
 * Display a new Transaction form as a table row
 */

module.exports = React.createClass({
  _cta: null,
  getInitialState: function () {
    return {
      name: '',
      price_listed: '',
      quantity: '',
      date_listed: moment().format(Constants.formats.dates.display),
      date_sold: '',
      price_sold: ''
    }
  },
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
  },
  submit: function () {
    var _self = this, obj = {};
    var _invalid = false;
    this._cta.find('input').each(function () {
      var $input = $(this);
      var val = $input.val().trim();
      if ($input.prop('required') && val == '') {
        _invalid = true;
        $input.addClass('invalid');
        return;
      }
      if ($input.hasClass('date')) {
        if (val != '') {
          var date = moment(val, Constants.formats.dates.display);
          if (!date.isValid()) {
            _invalid = true;
            $input.addClass('invalid');
            return;
          } else {
            val = date.unix();
          }
        }
      }
      obj[$input.attr('name')] = val;
    });

    if (_invalid) {
      this._cta.find('input.invalid').first().focus();
      alert('Missing a required field!');
      return false;
    }
    // now submit the form
    $.ajax({
      url: '/api/insert',
      dataType: 'json',
      data: obj,
      method: 'POST',
      success: function (resp) {
        if (Constants.ajax.validateResponse(resp)) {
          _self.setState(_self.getInitialState());
          _self.props.onUpdate(resp.transactions);
          return;
        }
        if (resp.error.errors) {
          for (var key in resp.error.errors) {
            _self._cta.find('input[name='+key+']').addClass('invalid');
          }
        }
      },
      error: function () {
        alert('An error occurred and your entry was not added');
      },
      complete: function () {
        // TODO: hide ajaxclassName="date"
      }
    });
  },
  handleChange: function(event) {
    var obj = {};
    obj[event.target.name] = event.target.value;
    this.setState(obj);
  },
  render: function () {
    return (
      <tr className="new-transaction">
        <td><input type="text" name="name" value={this.state.name} onChange={this.handleChange} required /></td>
        <td><input type="text" name="price_listed" value={this.state.price_listed} onChange={this.handleChange} required /></td>
        <td><input type="text" name="quantity" value={this.state.quantity} onChange={this.handleChange} required /></td>
        <td>&nbsp;</td>
        <td><input type="text" name="date_listed" className="date" value={this.state.date_listed} onChange={this.handleChange} required /></td>
        <td><input type="text" name="date_sold" className="date" value={this.state.date_sold} onChange={this.handleChange} /></td>
        <td><input type="text" name="price_sold" value={this.state.price_sold} onChange={this.handleChange} /></td>
        <td colSpan="2">&nbsp;</td>
        <td><button type="button" className="new-transaction-submit" onclick={this.submit}>+</button></td>
      </tr>
    )
  }
});