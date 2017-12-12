React = require('react/addons')

module.exports =
  Video: React.createClass render: ->
    <video className="widget-video" controls {...@props}>
      {@props.children}
    </video>

  Webpage: React.createClass
    reload: ->
      frame = @refs.frame.getDOMNode()
      oldInnerHTML = frame.innerHTML
      frame.innerHTML = ''
      setTimeout (-> frame.innerHTML = oldInnerHTML), 0


    render: ->
      <div className="widget-webpage-browser">
        <div className="widget-webpage-toolbar">
          <div className="widget-webpage-button">
            <img src="images/browser_back_disabled.png" />
          </div>
          <div className="widget-webpage-button">
            <img src="images/browser_forward_disabled.png" />
          </div>
          <div className="widget-webpage-button widget-webpage-button-enabled" onClick={@reload}>
            <img className="widget-webpage-button-normal" src="images/browser_reload_normal.png" />
            <img className="widget-webpage-button-hover" src="images/browser_reload_hover.png" />
            <img className="widget-webpage-button-active" src="images/browser_reload_pressed.png" />
          </div>
          <a
            className="widget-webpage-urlbar"
            href={@props.src}
            target="_blank"
            title="Click to open in new tab"
          >
          <span className="widget-webpage-urlbar-url">{@props.src}</span>
          &nbsp;
          <span className="widget-webpage-urlbar-hint">(Open in new tab)</span></a>
        </div>
        <div ref="frame" className="widget-webpage-frame-wrapper" style={(width: @props.width, height: @props.height)}>
          <iframe className="widget-webpage-frame" {...@props} width={undefined} height={undefined} />
        </div>
      </div>
