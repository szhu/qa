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
      styles = <style children={"""
        .card-disclosure {
          border: 1px solid #C2DCC2;
          color: black;
          cursor: pointer;
          font-size: 90%;
          padding: 0.2em 0.5em;
          text-align: left;
          margin: 0.3em 0;
          display: inline-block;
        }
        .card-disclosure-content {
          border: 1px solid #C2DCC2;
          margin: 0.7em 0;
          padding: 0.1em 0.5em 0.5em;
        }
        .card-disclosure-content .card-disclosure-content {
          border: none;
        }
      """} />

      entry = window.db[@props.id]
      if not entry?
        return <div>"Not found"</div>
      name = @props.children ? entry.name

      if @state.expanded
        <fieldset className="card-disclosure-content">
          <legend
            className="card-disclosure"
            onClick={=> @setState(expanded: false)}>
            {styles}
            &#x229f; {name}</legend>
          {entry.content}
        </fieldset>
      else
        <div
          className="card-disclosure"
          onClick={=> @setState(expanded: true)}>
          {styles}
          &#x229e; {name}</div>
