{ DisclosedCard } = require('./qa.cjsx')
{ Webpage, Video } = require('./qa-widgets.cjsx')

module.exports =

  'javac':
    name: "Install javac linter in Sublime"
    content:
      <div>
        <ol>
          <li><DisclosedCard id="st3"/> ok</li>
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
             src="http://cl.ly/1T2z3E1e2B0A/Screen%20Recording%202016-02-14%20at%2004.04%20PM.mp4.mp4" />

  'cmdpinstall':
    name: "Open the Command Palette and select Install Package"
    content:
      <Video height="400" width="402" type="video/mp4"
             src="http://cl.ly/0J0m420I1u18/Install%20package.mp4.mp4" />

  'sl':
    name: "Install SublimeLinter"
    content:
      <div>
        <DisclosedCard id="cmdpinstall" />{" "}&hellip; then install <code>SublimeLinter</code>
      </div>

  'sljc':
    name: "Install SublimeLinter-javac"
    content:
      <div>
        <DisclosedCard id="cmdpinstall" />{" "}&hellip; then install <code>SublimeLinter-javac</code>
      </div>
