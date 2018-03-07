import React from "react";

import GithubFileView from "components/GithubFileView";
import Github from "util/Github";

interface Props {
  github: Github;
  repo: string;
  branch?: string;
  filepath: string;
}

class GithubFileReadViewExpandableLink extends React.Component<Props> {
  state = {
    expanded: false
  };

  render() {
    if (this.state.expanded) {
      return (
        <fieldset className="card-disclosure-content card-disclosure-outer">
          <legend
            className="card-disclosure card-disclosure-expanded"
            onClick={() => this.setState({ expanded: false })}
          >
            &#x229f; {this.props.children}
          </legend>
          <GithubFileView {...this.props} />
        </fieldset>
      );
    } else {
      return (
        <div
          className="card-disclosure card-disclosure-collapsed card-disclosure-outer"
          onClick={() => this.setState({ expanded: true })}
        >
          &#x229e; {this.props.children}
        </div>
      );
    }
  }
}

export default GithubFileReadViewExpandableLink;
