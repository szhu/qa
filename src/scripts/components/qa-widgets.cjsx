React = require('react/addons')

module.exports =
  Video: React.createClass render: ->
    <video className="widget-video" controls {...@props}>
      <style children={"""
      .widget-video {
        background: black;
        border: 2px solid rgba(0,0,0,0.6);
        border-radius: 3px;
      }
      """} />      <source src={@props.src} type={@props.type} />
    </video>

  Webpage: React.createClass render: ->
    <div className="widget-webpage-browser">
      <style children={"""
      .widget-webpage-browser {
        border: 1px solid gainsboro;
        background: gainsboro;
        border-radius: 3px;
        display: inline-block;
      }
      .widget-webpage-toolbar {
        display: flex;
      }
      .widget-webpage-urlbar {
        align-items: center;
        background: white;
        color: black;
        display: flex;
        flex-grow: 1;
        font: 14px Arial;
        justify-content: center;
        margin: 3px;
        padding: 0.2em 0;
        text-decoration: none;
      }
      .widget-webpage-button {
        align-items: center;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        margin: 3px;
      }
      .widget-webpage-button img {
        height: 1.4em;
        width: auto;
      }
      .widget-webpage-frame-wrapper {
        overflow: hidden;
      }
      .widget-webpage-frame {
        border: none;
        height: 133.33333%;
        width: 133.33333%;
        -ms-zoom: 0.75;
        -moz-transform: scale(0.75);
        -moz-transform-origin: 0 0;
        -o-transform: scale(0.75);
        -o-transform-origin: 0 0;
        -webkit-transform: scale(0.75);
        -webkit-transform-origin: 0 0;
      }
      """} />
      <div className="widget-webpage-toolbar">
        <div className="widget-webpage-button">
          <img src="images/browser_back_hover.png" />
        </div>
        <div className="widget-webpage-button">
          <img src="images/browser_forward_hover.png" />
        </div>
        <a target="_blank" className="widget-webpage-urlbar" href={@props.src}>{@props.src}</a>
      </div>
      <div className="widget-webpage-frame-wrapper" style={(width: @props.width, height: @props.height)}>
        <iframe className="widget-webpage-frame" {...@props} width={undefined} height={undefined} />
      </div>
    </div>
