import React from "react";

import GithubLoginInfo from "components/GithubLoginInfo";
import TuiEditorComponent from "components/TuiEditorComponent";
import Github, {
  decodeContentFromGithub,
  encodeContentForGithub
} from "util/Github";
import * as LoadingStates from "util/LoadingStates";
import * as SavingStates from "util/SavingStates";

interface Props {
  github: Github;
  repo: string;
  branch?: string;
  filepath: string;
}

interface State {
  loading: LoadingStates.Value;
  saving: SavingStates.Value;
  loadedMarkdownContent?: string;
  loadedFileSha?: string;
}

class GithubFileEditor extends React.Component<Props, State> {
  root: React.ReactNode;
  githubLogin: GithubLoginInfo | null;
  editor: TuiEditorComponent | null;
  currentRequest: JQuery.jqXHR | undefined;

  /**
   * React component lifecycle
   */

  state: State = {
    loading: LoadingStates.INITIAL,
    saving: SavingStates.OK
  };

  async componentDidMount() {
    this.load();
  }

  async componentWillUnmount() {
    this.cancelRequest();
  }

  /**
   * Renderers
   */

  render() {
    let { github } = this.props;
    let { loading, saving } = this.state;

    return (
      <div ref={el => (this.root = el)} {...this.props}>
        <button
          className="githubeditor-control-revert"
          onClick={() => this.load()}
        >
          Load
        </button>
        <span children=" " />
        <button
          className="githubeditor-control-save"
          onClick={() => this.save()}
        >
          {saving.saveButtonLabel}
        </button>
        <span children=" " />
        <GithubLoginInfo
          className="githubeditor-login"
          github={github}
          ref={el => (this.githubLogin = el)}
        />
        {loading.message ? loading.message() : undefined}
        {loading.shouldShowEditor ? this.renderEditor() : undefined}
      </div>
    );
  }

  renderEditor() {
    let { loadedMarkdownContent } = this.state;

    return (
      <TuiEditorComponent
        initialValue={loadedMarkdownContent}
        initialEditType="markdown"
        previewStyle="vertical"
        height="300px"
        ref={el => (this.editor = el)}
      />
    );
  }

  /**
   * Helper methods
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
      loading: LoadingStates.LOADED,
      loadedMarkdownContent,
      loadedFileSha: response.sha
    });
  }

  async save() {
    let { branch, filepath, repo } = this.props;
    let { loading } = this.state;

    if (!loading.shouldShowEditor || !this.editor || !this.editor.value) {
      throw new Error("Can't save because there is no editor.");
    }
    if (!this.githubLogin) {
      throw new Error("No Github login component.");
    }

    // Make request.
    this.setState({ saving: SavingStates.SAVING });
    let request = this.request("PUT", `/repos/${repo}/contents/${filepath}`, {
      branch: branch,
      message: `Update ${filepath}`,
      committer: {
        name: this.githubLogin.userName,
        email: this.githubLogin.userEmail
      },
      content: encodeContentForGithub(this.editor.value),
      sha: this.state.loadedFileSha
    });

    // Receive response and handle errors.
    let response: {
      sha: string;
    };
    try {
      response = await request;
    } catch (request) {
      this.setState({ saving: SavingStates.SAVE_FAILED });
      throw request;
    }

    // Handle successful response.
    this.setState({
      saving: SavingStates.OK,
      loadedFileSha: response.sha
    });
  }
}

export default GithubFileEditor;
