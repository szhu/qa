React = require('react/addons')
Router = require('react-router')
{ Card, DisclosedCard } = require('./qa.cjsx')
{ Route, RouteHandler, Link } = Router

window.db = require('./qa-content')

# setDb db

module.exports = React.createClass
  # mixins: [ Router.State ]
  render: ->
    <Card id="javac" />
