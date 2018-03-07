import React from "react";
import Commonmark from "react-commonmark";
import { resolve } from "url";

import GithubFileReadViewExpandableLink from "components/GithubFileReadViewExpandableLink";
import getHashParams from "util/getHashParams";
import Github, { decodeContentFromGithub } from "util/Github";
import * as LoadingStates from "util/LoadingStates";

interface Props {
  github: Github;
  repo: string;
  branch?: string;
  filepath: string;
}

interface State {
  loading: LoadingStates.Value;
  loadedMarkdownContent?: string;
}

class GithubFileReadView extends React.Component<Props, State> {
  currentRequest: JQuery.jqXHR | undefined;

  /**
   * React component lifecycle
   */

  state: State = {
    loading: LoadingStates.INITIAL
  };

  async componentDidMount() {
    await this.load();
  }

  async componentWillUnmount() {
    this.cancelRequest();
  }

  /**
   * Renderers
   */

  renderers = {
    link: (props: React.HTMLProps<HTMLAnchorElement>): React.ReactNode => {
      if (!props.href) {
        return <a {...props} />;
      }

      interface AllowedHashParams {
        urlWithoutHash: string;
        type?: string;
        height?: string;
        width?: string;
        target?: string;
      }

      let hashParams: AllowedHashParams = getHashParams(props.href);
      let url: string = hashParams.urlWithoutHash;
      let urlIsAbsolute = props.href.match(/:\/\//);

      let type;
      if ((hashParams.type || "").match(/iframe|inlinelink|normallink|video/)) {
        type = hashParams.type;
      } else {
        type = urlIsAbsolute ? "normallink" : "inlinelink";
      }

      switch (type) {
        case "iframe": {
          return (
            <GithubFileReadViewIframe
              src={url}
              height={hashParams.height}
              width={hashParams.width}
            >
              {props.children}
            </GithubFileReadViewIframe>
          );
        }
        case "inlinelink": {
          return (
            <GithubFileReadViewExpandableLink
              repo={this.props.repo}
              filepath={resolve(this.props.filepath, url)}
              github={this.props.github}
            >
              {props.children}
            </GithubFileReadViewExpandableLink>
          );
        }
        case "normallink": {
          return (
            <a href={props.href} target={hashParams.target || "_blank"}>
              {props.children}
            </a>
          );
        }
        case "video": {
          return (
            <video
              className="widget-video"
              controls={true}
              height={hashParams.height}
              width={hashParams.width}
              src={url}
            />
          );
        }
        default: {
          throw `Invalid link type: ${type}`;
        }
      }
    },
    paragraph: (props: React.HTMLProps<HTMLParagraphElement>) => {
      return <div className="para">{props.children}</div>;
    }
  };

  render() {
    let { loading } = this.state;

    return (
      <div>
        {loading.message ? loading.message() : undefined}
        {loading.hasContent ? this.renderContent() : undefined}
      </div>
    );
  }

  renderContent() {
    let { loadedMarkdownContent } = this.state;

    return (
      <Commonmark
        source={loadedMarkdownContent || ""}
        renderers={Object.assign({}, Commonmark.renderers, this.renderers)}
      />
    );
  }

  /**
   * Helpers
   */

  async request(method: string, path: string, dataObject?: {}) {
    let { github } = this.props;

    this.cancelRequest();
    this.currentRequest = github.request(method, path, dataObject);
    let response = await this.currentRequest;
    this.currentRequest = undefined;
    return response;
  }

  async cancelRequest() {
    if (this.currentRequest) {
      this.currentRequest.abort();
      this.currentRequest = undefined;
    }
  }

  async load() {
    let { filepath, repo } = this.props;
    let { loading } = this.state;

    // Make request.
    this.setState({ loading: loading.transitions.startLoad() });
    let request = this.request("GET", `/repos/${repo}/contents/${filepath}`);

    // Receive response and handle errors.
    let response: {
      content: string;
      sha: string;
    };
    try {
      response = await request;
    } catch (request) {
      switch (request.status) {
        case 401:
          return this.setState({ loading: LoadingStates.LOAD_FAILED_401 });
        case 404:
          return this.setState({ loading: LoadingStates.LOAD_FAILED_404 });
        default: {
          throw request;
        }
      }
    }

    // Handle successful response.
    let loadedMarkdownContent = decodeContentFromGithub(response.content);
    this.setState({
      loadedMarkdownContent
    });

    this.setState({ loading: LoadingStates.LOADED });
  }
}

export default GithubFileReadView;
