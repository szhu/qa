React = require('react/addons')
Router = require('react-router')
qa = require('./qa.cjsx')
{ Route, RouteHandler, Link } = Router


window.db =
  'javac':
    name: "Install javac linter in Sublime"
    content:
      <div>
        <ol>
          <li><qa.DisclosedCard id="st3" /></li>
          <li><qa.DisclosedCard id="pctrl" /></li>
          <li><qa.DisclosedCard id="sl" children="Install SublimeLinter" /></li>
          <li><qa.DisclosedCard id="sljc" children="Install SublimeLinter-javac" /></li>
        </ol>
      </div>
  'st3':
    name: "Install Sublime Text 3"
    content:
      <div>
        <ol>
          <li><a href="https://www.sublimetext.com/3">www.sublimetext.com/3</a><br/>
              <iframe width="100%" height="300" src="https://www.sublimetext.com/3" /></li>
          <li>Download the one for your operating system. It should have a black bullet next to it.</li>
        </ol>
      </div>
  'pctrl':
    name: "Install Package Control"
    content:
      <div>
        <video width="300" controls>
          <source src="http://cl.ly/2X1d3m073I2v/Screen%20Recording%202016-02-14%20at%2004.04%20PM.mov" type="video/mp4" />
        </video>
      </div>
  'cmdpinstall':
    name: "Open the Command Palette and select Install Package"
    content:
      <div>
        <video width="300" controls>
          <source src="http://cl.ly/2W2X2W0S2116/Install%20package.mov" type="video/mp4" />
        </video>
      </div>
  'sl':
    name: "Install SublimeLinter"
    content:
      <div>
        <ol>
          <li><qa.DisclosedCard id="cmdpinstall" /></li>
          <li>Install SublimeLinter</li>
        </ol>
      </div>
  'sljc':
    name: "Install SublimeLinter-javac"
    content:
      <div>
        <ol>
          <li><qa.DisclosedCard id="cmdpinstall" /></li>
          <li>Install SublimeLinter-javac</li>
        </ol>
      </div>

# qa.setDb db

module.exports = React.createClass
  # mixins: [ Router.State ]
  render: ->
    <qa.Card id="javac" />
