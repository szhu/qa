React = require('react/addons')

module.exports =
  # setDb: (db) ->
  #   module.db = db

  Card: React.createClass
    render: ->
      entry = window.db[@props.id]
      <fieldset>
          <legend>{entry.name}</legend>
          {entry.content}
      </fieldset>

  DisclosedCard: React.createClass
    getInitialState: ->
      expanded: false

    render: ->
      entry = window.db[@props.id]
      if not entry?
        return <div>"Not found"</div>
      name = @props.children ? entry.name

      if @state.expanded
        <fieldset>
            <legend
              onClick={=> @setState(expanded: false)}>
              [&minus;] {name}</legend>
            {entry.content}
        </fieldset>
      else
        <legend
          onClick={=> @setState(expanded: true)}
          >[+] {name}</legend>
