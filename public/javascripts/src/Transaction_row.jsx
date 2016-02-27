/**
 * Display a Transaction as a table row
 */

var EditRow = require('./Transaction/Row_Edit.jsx');
var ViewRow = require('./Transaction/Row_View.jsx');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      _edit: false,
      transaction: $.extend(false, this.props.transaction)
    };
  },
  updateRow: function () {
    var _self = this;
    $.ajax({
      url: '/api/update',
      dataType: 'json',
      method: 'POST',
      data: this.state.transaction,
      success: function (resp) {
        if (Constants.ajax.validateResponse(resp)) {
          _self.uneditRow();
          _self.props.onUpdate(resp.transactions);
          return;
        }
        alert('An error occurred and your entry was not updated.');
      },
      error: function () {
        alert('An error occurred and your entry was not updated.');
      },
      complete: function () {
        // TODO: hide ajaxclassName="date"
      }
    });
  },
  deleteRow: function () {
    if (!confirm("are you sure you want to delete this object? This action can not be undone.")) {
      return false;
    }
    var _self = this;
    $.ajax({
      url: '/api/delete',
      dataType: 'json',
      data: {
        id: this.state.transaction._id
      },
      method: 'POST',
      success: function (resp) {
        if (Constants.ajax.validateResponse(resp)) {
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
  onCancel: function () {
    this.setState(this.getInitialState());
  },
  uneditRow: function () {
    this.setState({_edit: false});
  },
  editRow: function () {
    this.setState({_edit: true});
  },
  handleChange: function(event) {
    if (event.target.type == 'checkbox') {
      this.state.transaction[event.target.name] = event.target.checked;
    } else if (event.target.type == 'date') {
      if (event.target.value.trim() == '') {
        this.state.transaction[event.target.name] = '';
      } else {
        this.state.transaction[event.target.name] = moment(event.target.value, Constants.formats.dates.input).unix();
      }
    } else {
      this.state.transaction[event.target.name] = event.target.value;
    }
    this.setState({transaction: this.state.transaction});
  },
  render: function () {
    if (this.state._edit) {
      return <EditRow transaction={this.state.transaction} onChange={this.handleChange} onSubmit={this.updateRow} onCancel={this.onCancel} />
    } else {
      return <ViewRow transaction={this.state.transaction} onEditClick={this.editRow} />
    }
  }
});