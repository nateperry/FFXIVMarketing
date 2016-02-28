/**
 * Display a Transaction as a table row
 */

var EditRow = require('./Transaction/Row_Edit.jsx');
var ViewRow = require('./Transaction/Row_View.jsx');
var NewRow  = require('./Transaction/Row_New.jsx');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      _edit: false,
      _original: $.extend(false, this.props.transaction)
    };
  },
  insertRow: function () {
    var _self = this;
    var _cta = $(ReactDOM.findDOMNode(this));
    var valid = Constants.validateTransaction(this.props.transaction);
    if (valid != true) {
      var errorStr = '';
      for (var i=0; i < valid.length; i++) {
        var error = valid[i];
        errorStr += error.msg + '\n';
        _cta.find('input[name='+error.prop+']').addClass('invalid');
      }
      alert('Validation Error:'+errorStr);
      return false;
    }
    // now submit the form
    $.ajax({
      url: '/api/insert',
      dataType: 'json',
      data: this.props.transaction,
      method: 'POST',
      success: function (resp) {
        if (Constants.ajax.validateResponse(resp)) {
          _self.props.onUpdate(resp.transactions);
          _cta.find('input[name=name]').focus();
          return;
        }
        var errorStr = '';
        if (resp.error.errors) {
          for (var key in resp.error.errors) {
            _cta.find('input[name='+key+']').addClass('invalid');
            errorStr += resp.error.errors[key].message + '\n';
          }
        }
        alert(resp.message + '\n' + errorStr);
      },
      error: function () {
        alert('An error occurred and your entry was not added');
      },
      complete: function () {
        // TODO: hide ajaxclassName="date"
      }
    });
  },
  updateRow: function () {
    var _self = this;
    $.ajax({
      url: '/api/update',
      dataType: 'json',
      method: 'POST',
      data: this.props.transaction,
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
        id: this.props.transaction._id,
        character_id: this.props.transaction.character_id,
        retainer_id: this.props.transaction.retainer_id
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
    this.props.onCancel(this.props.transaction, this.state._original);
  },
  uneditRow: function () {
    this.setState({_edit: false});
  },
  editRow: function () {
    this.setState({_edit: true});
  },
  handleChange: function(event) {
    var transaction = this.props.transaction;
    if (event.target.type == 'checkbox') {
      transaction[event.target.name] = event.target.checked;
    } else if (event.target.type == 'date') {
      if (event.target.value.trim() == '') {
        transaction[event.target.name] = '';
      } else {
        transaction[event.target.name] = moment(event.target.value, Constants.formats.dates.input).unix();
      }
    } else {
      transaction[event.target.name] = event.target.value;
    }
    this.setState({transaction: transaction});
  },
  render: function () {
    if (this.state._edit) {
      return <EditRow transaction={this.props.transaction} onChange={this.handleChange} onSubmit={this.updateRow} onCancel={this.onCancel} key={this.props.key} />
    } else if (this.props.isNew) {
      return <NewRow transaction={this.props.transaction} owner={this.props.owner} onChange={this.handleChange} onSubmit={this.insertRow} />
    } else {
      return <ViewRow transaction={this.props.transaction} onEditClick={this.editRow} onDeleteClick={this.deleteRow} />
    }
  }
});