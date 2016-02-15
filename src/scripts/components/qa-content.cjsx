{ DisclosedCard } = require('./qa.cjsx')
{ Webpage, Video } = require('./qa-widgets.cjsx')

module.exports =

  'javac':
    name: "Install javac linter in Sublime"
    content:
      <div>
        <ol>
          <li><DisclosedCard id="st3"/></li>
          <li><DisclosedCard id="pctrl" /></li>
          <li><DisclosedCard id="sl" /></li>
          <li><DisclosedCard id="sljc" /></li>
        </ol>
      </div>

  'st3':
    name: "Install Sublime Text 3"
    content:
      <div>
        <p>Download the one for your operating system. It should have a black bullet next to it.</p>
        <Webpage width="600" height="300" src="https://www.sublimetext.com/3" />
      </div>

  'pctrl':
    name: "Install Package Control"
    content:
      <Video height="400" width="483" type="video/mp4"
             src="http://cl.ly/2X1d3m073I2v/Screen%20Recording%202016-02-14%20at%2004.04%20PM.mov" />

  'cmdpinstall':
    name: "Open the Command Palette and select Install Package"
    content:
      <Video height="400" width="402" type="video/mp4"
             src="http://cl.ly/2W2X2W0S2116/Install%20package.mov" />

  'sl':
    name: "Install SublimeLinter"
    content:
      <div>
        <DisclosedCard id="cmdpinstall" />
        <p>&hellip;then install <code>SublimeLinter</code></p>
      </div>

  'sljc':
    name: "Install SublimeLinter-javac"
    content:
      <div>
        <DisclosedCard id="cmdpinstall" />
        <p>&hellip;then install <code>SublimeLinter-javac</code></p>
      </div>
