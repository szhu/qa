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
        <fieldset className="card-disclosure-content card-disclosure-outer">
          <legend
            className="card-disclosure card-disclosure-expanded"
            onClick={=> @setState(expanded: false)}>
            &#x229f; {name}</legend>
          {entry.content}
        </fieldset>
      else
        <div
          className="card-disclosure card-disclosure-collapsed card-disclosure-outer"
          onClick={=> @setState(expanded: true)}>
          &#x229e; {name}</div>
