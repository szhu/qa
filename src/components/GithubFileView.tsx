import React from "react";

import GithubFileEditor from "components/GithubFileEditor";
import GithubFileReadView from "components/GithubFileReadView";
import Github from "util/Github";

interface Props {
  github: Github;
  repo: string;
  branch?: string;
  filepath: string;
}

interface State {
  editMode: boolean;
}

class GithubFileView extends React.Component<Props, State> {
  editView: GithubFileEditor | null;
  readView: GithubFileReadView | null;

  constructor(props: Props) {
    super(props);
    this.state = {
      editMode: false
    };
  }

  render() {
    return (
      <div>
        {this.props.github.canEdit()
          ? [
              <a
                href={this.state.editMode ? "javascript:" : undefined}
                onClick={() => this.setState({ editMode: false })}
                key="view"
              >
                View
              </a>,
              " ",
              <a
                href={this.state.editMode ? undefined : "javascript:"}
                onClick={() => this.setState({ editMode: true })}
                key="edit"
              >
                Edit
              </a>,
              " ",
              <span key="filename">
                {this.state.editMode ? `: ${this.props.filepath}` : undefined}
              </span>
            ]
          : undefined}
        {this.state.editMode ? (
          <GithubFileEditor {...this.props} ref={el => (this.editView = el)} />
        ) : (
          <GithubFileReadView
            {...this.props}
            ref={el => (this.readView = el)}
          />
        )}
      </div>
    );
  }

  componentDidUpdate() {
    if (!this.state.editMode && this.readView) {
      this.readView.load();
    }
  }
}

export default GithubFileView;
