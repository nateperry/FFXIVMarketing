
module.exports = React.createClass({
  _cta: null,
  getInitialState: function () {
    return JSON.parse(document.getElementById('user-object').innerHTML) || {};
  },
  componentDidMount: function () {
    var _self = this;
    this._cta = $('#user-profile-characters');

    var newChar =$('#new-character');
    newChar.on('keypress', function (e) {
      if (e.which == 13) {
        _self.addCharacter(this);
        newChar.val('');
      }
    });

    $('#new-character-submit').on('click', function () {
      _self.addCharacter(newChar[0]);
      newChar.val('');
    });
  },
  addCharacter: function (input) {
    var character = {};
    if (input.value.trim() == '') {
      return;
    }
    character['isNew'] = true;
    character['character_name'] = input.value.trim();
    character['retainers'] = [];
    this.state.characters.push(character);
    this.setState(this.state);
    input.value = '';
  },
  addRetainer: function (event) {
    var input = this._cta.find('.new-retainer[data-index='+event.target.dataset.index+']')[0];
    var retainer = {};
    if (input.value.trim() == '') {
      return;
    }
    retainer['isNew'] = true;
    retainer['retainer_name'] = input.value.trim();
    this.state.characters[input.dataset.index].retainers.push(retainer);
    this.setState(this.state);
    input.value = '';
  },
  deleteCharacter: function (event) {
    this.state.characters.splice(event.target.dataset.index, 1);
    this.setState(this.state);
  },
  deleteRetainer: function (event) {
    this.state.characters[event.target.dataset.index].retainers.splice(event.target.dataset.ret_index, 1);
    this.setState(this.state);
  },
  onCharacterChange: function (event) {
    this.state.characters[event.target.dataset.index][event.target.name] = event.target.value.trim();
    this.setState(this.state);
  },
  onRetainerChange: function (event) {
    this.state.characters[event.target.dataset.index].retainers[event.target.dataset.ret_index][event.target.name] = event.target.value.trim();
    this.setState(this.state);
  },
  render: function () {
    var _self = this;
    var user = this.state;
    return (
      <table id="user-profile-characters" className="table-grouped">
        <thead>
          <tr>
            <th>Character</th>
            <th className="align-left">Retainers</th>
          </tr>
        </thead>
        <tbody>
          {user.characters.map(function (character, charIndex) {
            return (
              <tr key={charIndex}>
                <td>
                  <input type="text" name="character_name" value={character.character_name} onChange={_self.onCharacterChange} data-index={charIndex} />
                  <input type="hidden" name="character_new" value={character.isNew? 'true' : 'false'} />
                  <button type="button" onClick={_self.deleteCharacter} data-index={charIndex}>x</button>
                </td>
                <td>
                  <table>
                    <tbody>
                      {character.retainers.map(function (retainer, retIndex) {
                        return (
                          <tr key={retIndex}>
                            <td>
                              <input type="text" name={charIndex + '_retainer_name'} value={retainer.retainer_name} onChange={_self.onRetainerChange} data-index={charIndex} data-ret_index={retIndex} key={retIndex} />
                              <input type="hidden" name={charIndex + '_retainer_new'} value={retainer.isNew? 'true' : 'false'} />
                              <button type="button" onClick={_self.deleteRetainer} data-index={charIndex} data-ret_index={retIndex}>x</button>
                            </td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td>
                          <input className="new-retainer" type="text" data-index={charIndex} placeholder="Retainer's Name" />
                          <button className="new-retainer-submit" type="button" data-index={charIndex} onClick={_self.addRetainer}>+</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            );
          })}
          <tr>
            <td>
              <input id="new-character" type="text" placeholder="Character's Name" />
              <button id="new-character-submit" type="button">+</button>
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
});