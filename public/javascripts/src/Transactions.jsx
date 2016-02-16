var Transaction_row = require('./Transaction_row.jsx');
var Transaction_new_row = require('./Transaction_new_row.jsx');

module.exports = React.createClass({
  _cta: null,
  getInitialState: function (props) {
    // set initial application state
    return {
      transactions: props || JSON.parse(document.getElementById('initial-trans').innerHTML) || []
    };
  },
  componentWillReceiveProps: function(newProps, oldProps){
    this.setState(this.getInitialState(newProps));
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
        if (resp.result == 'ERR') {
          if (resp.error.errors) {
            for (var key in resp.error.errors) {
              _self._cta.find('input[name='+key+']').addClass('invalid');
            }
          }
        } else if (resp.result == 'OK') {
          _self.setState({transactions: resp.transactions});
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
        <Transaction_new_row />
        </tbody>
      </table>
    );
  }
});