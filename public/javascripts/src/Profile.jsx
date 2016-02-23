
var Characters = require('./Profile_Characters.jsx');

module.exports = React.createClass({
  getInitialState: function () {
    return JSON.parse(document.getElementById('user-object').innerHTML) || {};
  },
  handleChange: function(event) {
    this.state[event.target.name] = event.target.value.trim();
    this.setState(this.state);
  },
  passwordsMatch: function () {
    return (this.state.new_password == this.state.conf_password);
  },
  render: function () {
    var _self = this;
    var user = this.state;
    return (
      <div>
        <h3>Account Info</h3>
        <label htmlFor="user-email">
          <span className="label-text">Email</span>
          <input id="user-email" name="email" type="email" value={user.email} onChange={this.handleChange} />
        </label>
        <h3>Change Password</h3>
        {(user.conf_password !== '' && user.conf_password !== undefined)?this.passwordsMatch()?<p className="form-success">Passwords match!</p>:<p className="form-error">Passwords don't match!</p>:''}
        <label htmlFor="user-password">
          <span className="label-text">New Password</span>
          <input id="user-password" name="new_password" type="password" value={user.new_password} onChange={this.handleChange} />
        </label>
        <label htmlFor="user-conf-password">
          <span className="label-text">Confirm Password</span>
          <input id="user-conf-password" name="conf_password" type="password" value={user.conf_password} onChange={this.handleChange} />
        </label>
      </div>
    )
  }
});