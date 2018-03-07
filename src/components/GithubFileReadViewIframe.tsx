import React from "react";

let imageUrl = (assetName: string) => {
  return require(`./GithubFileReadViewIframe/${assetName}.png`);
};

interface Props {
  src: string;
  width: string | number | undefined;
  height: string | number | undefined;
}

class GithubFileReadViewIframe extends React.Component<Props> {
  frame: HTMLIFrameElement | null;

  render() {
    return (
      <div className="widget-webpage-browser">
        <div className="widget-webpage-toolbar">
          <div className="widget-webpage-button">
            <img src={imageUrl("browser_back_disabled")} />
          </div>
          <div className="widget-webpage-button">
            <img src={imageUrl("browser_forward_disabled")} />
          </div>
          <div
            className="widget-webpage-button widget-webpage-button-enabled"
            onClick={this.reload}
          >
            <img
              className="widget-webpage-button-normal"
              src={imageUrl("browser_reload_normal")}
            />
            <img
              className="widget-webpage-button-hover"
              src={imageUrl("browser_reload_hover")}
            />
            <img
              className="widget-webpage-button-active"
              src={imageUrl("browser_reload_pressed")}
            />
          </div>
          <span children=" " />
          <a
            className="widget-webpage-urlbar"
            href={this.props.src}
            target="_blank"
            title="Click to open in new tab"
          >
            <span className="widget-webpage-urlbar-url">{this.props.src}</span>
            <span children=" " />
            <span className="widget-webpage-urlbar-hint">
              (Open in new tab)
            </span>
          </a>
        </div>
        <div
          className="widget-webpage-frame-wrapper"
          style={{
            width: this.props.width && this.props.width + "px",
            height: this.props.height && this.props.height + "px"
          }}
        >
          <iframe
            className="widget-webpage-frame"
            {...this.props}
            width={undefined}
            height={undefined}
            ref={el => (this.frame = el)}
          />
        </div>
      </div>
    );
  }

  reload = async () => {
    if (!this.frame) {
      return;
    }

    this.frame.src = this.props.src + "";
  }
}

export default GithubFileReadViewIframe;
