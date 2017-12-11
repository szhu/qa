"use strict";
/*
global
  $
  React
  reactCommonmark
  ReactDOM
  SimpleMDE
  utf8
*/

function Url(protocol, domain, path, params) {
  if (!protocol.match(/^[a-z0-9]+$/))
    throw `Invalid protocol: ${protocol}`;
  if (!domain.match(/^[^/]+$/))
    throw `Invalid domain: ${domain}`;
  if (!path.match(/^\/.*$/))
    throw `Invalid path: ${path}`;
  var paramsString = params
    ? "?" + $.param(params)
    : "";
  return `${protocol}://${domain}${path}${paramsString}`;
}

function encodeContentForGithub(normalString) {
  return btoa(utf8.encode(normalString));
}

function decodeContentFromGithub(encodedString) {
  return utf8.decode(atob(encodedString));
}

const Commonmark = reactCommonmark;

class Github {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  request(method, path, dataObject) {
    return $.ajax({
      type: method,
      url: Url("https", "api.github.com", path),
      headers: {
        "Authorization": this.accessToken ? `Bearer ${this.accessToken}` : undefined,
        "Accept": "application/vnd.github.v3+json",
      },
      contentType: "application/json",
      data: (method == "GET")
        ? dataObject
        : JSON.stringify(dataObject),
    });
  }
}

function ReactComponentWithFiniteStates(finiteStates) {
  return class ReactComponentWithFiniteStates extends React.Component {
    constructor(...args) {
      super(...args);
      this._checkFiniteStates();
    }

    _checkFiniteStates() {
      for (let [stateName, state] of Object.entries(finiteStates)) {
        for (let [transitionName, newState] of Object.entries(state.transitions)) {
          try {
            this._ensureValidState(newState);
          }
          catch (err) {
            throw `Transition ${stateName}.${transitionName} -> ${newState}: ${err}`;
          }
        }
      }
    }

    _ensureValidState(state) {
      if (state in finiteStates) {
        return state;
      }
      else {
        throw `State ${state} is invalid`;
      }
    }

    finiteState() {
      return finiteStates[this.state.finiteState];
    }

    // Convenience function that will follow the input either as a transition or a new state.
    transitionFiniteState(transitionOrNewState) {
      if (transitionOrNewState in finiteStates) {
        this._setFiniteState(transitionOrNewState);
      }
      else {
        this._transitionFiniteState(transitionOrNewState);
      }
    }

    // Follow the given transition to a new state.
    _transitionFiniteState(transition) {
      const newState = this.finiteState().transitions[transition];
      if (!newState) {
        throw `Transition ${this.state.finiteState}.${transition} doesn't exist`;
      }
      this._setFiniteState(newState);
    }

    // Go to the given state.
    _setFiniteState(newState) {
      this.setState({finiteState: newState});
    }
  };
}

function makePromisedElement(handlers) {
  var {onLoad, onUnload} = handlers || {};

  function f() {
    return f.promise;
  }

  f.lastEl = null;
  f.onLoad = onLoad || function() {};
  f.onUnload = onUnload || function() {};

  f.resetPromise = function() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  };

  f.receive = function(el) {
    if (el !== this.lastEl) {
      // Note that both conditions can technically be true, although
      // AFAIK they won't both be true if we use React.
      if (this.lastEl !== null) {
        // The element disapppeared.
        this.reject();
        this.resetPromise();
        this.onUnload(this.lastEl);
      }
      if (el !== null) {
        // The element appeared.
        this.resolve(el);
        this.onLoad(el);
      }
    }
    this.lastEl = el;
  };
  f.receive = f.receive.bind(f);

  f.resetPromise();
  return f;
}

class GithubLoginInfo extends React.Component {
  render() {
    return (
      <span {...this.props}>
        Signed in as
        <span> </span>
        <img className="github-user-avatar"
          src={this.state.user.avatar_url && `${this.state.user.avatar_url}&s=32`} />
        <span> </span>
        <span className="github-user-login">
          {this.state.user.login}</span>
        <span> </span>
        <input className="github-user-name"
          type="text"
          placeholder="Committer Name"
          value={this.state.userInputName || this.state.user.name || ""}
          onChange={(event) => this.setState({userInputName: event.target.value})} />
        <input className="github-user-email"
          type="email"
          placeholder="Committer email"
          value={this.state.userInputEmail || this.state.primaryEmail || ""}
          onChange={(event) => this.setState({userInputEmail: event.target.value})} />
      </span>
    );
  }

  state = {
    user: {},
    userInputName: null,
    userInputEmail: null,
  };

  componentWillMount() {
    this.retrieveUserInfo();
    this.retrieveUserEmails();
  }

  async retrieveUserInfo() {
    const info = await this.props.github.request(
      "GET", "/user"
    );
    this.setState({
      user: info,
    });
  }

  async retrieveUserEmails() {
    const emails = await this.props.github.request(
      "GET", "/user/emails"
    );
    this.setState({
      primaryEmail: emails.filter((emailObj) => emailObj.primary)[0].email,
    });
  }
}

class GithubFileView extends React.Component {
  render() {
    return (
      <div>
        {
          this.props.github.accessToken
            ? [
              <a href={this.state.editMode ? "javascript:" : undefined}
                onClick={() => this.setState({editMode: false})}
                key="view">View</a>,
              " ",
              <a href={this.state.editMode ? undefined : "javascript:"}
                onClick={() => this.setState({editMode: true})}
                key="edit">Edit</a>,
              " ",
              <span key="filename">
                {this.state.editMode
                  ? `: ${this.props.filepath}`
                  : undefined}
              </span>
            ]
            : undefined
        }
        {
          this.state.editMode
            ? <GithubFileEditor {...this.props}
              ref={(el) => this.editView = el} />
            : <GithubFileReadView {...this.props}
              ref={(el) => this.readView = el} />
        }
      </div>
    );
  }

  state = {
    editMode: false,
  }

  componentDidUpdate() {
    if (!this.state.editMode) {
      this.readView.load();
    }
  }
}

const GithubFileStates = {
  INITIAL: {
    hasContent: false,
    shouldShowEditor: false,
    transitions: {
      startLoad: "LOADING",
    },
  },
  LOADING: {
    hasContent: false,
    shouldShowEditor: false,
    message: () => {
      return <span>Loading…</span>;
    },
    transitions: {
      startLoad: "LOADING",
    },
  },
  LOADED: {
    hasContent: true,
    shouldShowEditor: true,
    transitions: {
      startLoad: "RELOADING",
    },
  },
  RELOADING: {
    hasContent: true,
    shouldShowEditor: true,
    message: () => {
      return <span>Loading…</span>;
    },
    transitions: {
      startLoad: "RELOADING",
    },
  },
  LOAD_FAILED_401: {
    hasContent: false,
    shouldShowEditor: false,
    message: () => {
      return (
        <div>
          <div>The GitHub API returned a 401 Unauthorized error. Your login might be invalid.</div>
          <div><input type="button" onClick={() => localStorage["szhu.qa.login"] = ""} value="Click here" /> to log out.</div>
          <div>Then refresh the page.</div>
        </div>
      );
    },
    transitions: {
      startLoad: "LOADING",
    },
  },
  LOAD_FAILED_404: {
    hasContent: false,
    shouldShowEditor: true,
    message: () => {
      return (
        <div>
          <div>Page not found.</div>
        </div>
      );
    },
    transitions: {
      startLoad: "LOADING",
    },
  },
};

class GithubFileEditor extends ReactComponentWithFiniteStates(GithubFileStates) {
  render() {
    return (
      <div ref={this.root.receive} {...this.props}>
        <button className="githubeditor-control-revert"
          onClick={() => this.load()}>
          Load</button>
        <button className="githubeditor-control-save"
          onClick={() => this.save()}>
          {this.state.saving ? "Saving…" : "Save"}</button>
        <span> </span>
        <GithubLoginInfo className="githubeditor-login"
          github={this.props.github} />
        { this.finiteState().message
          ? this.finiteState().message()
          : undefined }
        { this.finiteState().shouldShowEditor
          ? this.renderEditor()
          : undefined }

      </div>
    );
  }

  renderEditor() {
    return (
      <textarea className="githubeditor-simplemde-container"
        ref={this.simplemdeContainer.receive}
        {...this.props}></textarea>
    );
  }

  state = {
    finiteState: "INITIAL",
  };

  constructor() {
    super();
    this.root = makePromisedElement();
    this.simplemdeContainer = makePromisedElement({
      onLoad: async (el) => {
        this.simplemde.receive(new SimpleMDE({
          element: el,
          autoDownloadFontAwesome: false,
          commonmark: {smart: true},
        }));
      },
      onUnload: async () => {
        this.simplemde.receive(null);
      },
    });
    this.simplemde = makePromisedElement({
      onUnload: async (el) => {
        el.toTextArea();
      }
    });
  }

  async componentDidMount() {
    await this.load();
    // this.simplemde.codemirror.clearHistory();
  }

  async load() {
    this.transitionFiniteState("startLoad");
    try {
      this.fetchedFile = await this.props.github.request(
        "GET", `/repos/${this.props.repo}/contents/${this.props.filepath}`
      );
    }
    catch (request) {
      switch (request.status) {
        case 401:
          return this.transitionFiniteState("LOAD_FAILED_401");
        case 404:
          this.setState({
            loadedFileSha: undefined,
          });
          return this.transitionFiniteState("LOAD_FAILED_404");
        default:
          throw request;
      }
    }

    this.setState({
      loadedMarkdownContent: decodeContentFromGithub(this.fetchedFile.content),
      loadedFileSha: this.fetchedFile.sha,
    });
    this.simplemde().then((simplemde) => {
      window.simplemde = simplemde;
      window.loadedMarkdownContent = this.state.loadedMarkdownContent;
      simplemde.value(this.state.loadedMarkdownContent);
    });
    return this.transitionFiniteState("LOADED");
  }

  async save() {
    if (!this.finiteState().shouldShowEditor)
      throw "Can't save because there is no editor.";

    this.setState({saving: true});
    var simplemde = await this.simplemde();
    var updatedFile = await this.props.github.request(
      "PUT", `/repos/${this.props.repo}/contents/${this.props.filepath}`, {
        branch: this.props.branch,
        message: `Update ${this.props.filepath}`,
        committer: {
          name: $(this.root).find(".github-user-name").val(),
          email: $(this.root).find(".github-user-email").val(),
        },
        content: encodeContentForGithub(simplemde.value()),
        sha: this.state.loadedFileSha,
      }
    );
    this.fetchedFile = updatedFile.content;

    this.setState({
      saving: false,
      loadedFileSha: this.fetchedFile.sha,
    });
    return this.transitionFiniteState("LOADED");
  }
}

class GithubFileReadView extends ReactComponentWithFiniteStates(GithubFileStates) {
  render() {
    return <div>
      { this.finiteState().message
        ? this.finiteState().message()
        : undefined }
      { this.finiteState().hasContent
        ? this.renderContent()
        : undefined }
    </div>;
  }

  renderContent() {
    return <Commonmark
      source={this.state.markdownContent}
      renderers={Object.assign({}, Commonmark.renderers, this.renderers)}
      ref={(el) => this.commonmark = el} />;
  }

  renderers = {
    link: (props) => {
      if (props.href.match(/:\/\//)) {
        return <a href={props.href} target="_blank">{props.children}</a>;
      }
      else {
        return <GithubFileReadViewExpandableLink
          repo={this.props.repo}
          filepath={`howto/${props.href}`}
          github={this.props.github}
          name={props.children} />;
      }
    },
    paragraph: (props) => {
      return <GithubFileReadViewParagraph {...props} />;
    },
  };

  state = {
    finiteState: "INITIAL",
  }

  async componentDidMount() {
    await this.load();
  }

  async componentWillUnmount() {
    this.fetchedFileRequest && this.fetchedFileRequest.abort();
  }

  async load() {
    this.transitionFiniteState("startLoad");
    try {
      this.fetchedFileRequest = this.props.github.request(
        "GET", `/repos/${this.props.repo}/contents/${this.props.filepath}`
      );
      this.fetchedFile = await this.fetchedFileRequest;
    }
    catch (request) {
      switch (request.status) {
        case 0:
          return;
        case 401:
          return this.transitionFiniteState("LOAD_FAILED_401");
        case 404:
          return this.transitionFiniteState("LOAD_FAILED_404");
        default:
          throw request;
      }
    }

    this.setState({
      markdownContent: decodeContentFromGithub(this.fetchedFile.content),
    });
    return this.transitionFiniteState("LOADED");
  }
}

class GithubFileReadViewExpandableLink extends React.Component {
  render() {
    if (this.state.expanded) {
      return (
        <fieldset className="card-disclosure-content card-disclosure-outer">
          <legend
            className="card-disclosure card-disclosure-expanded"
            onClick={() => this.setState({expanded: false})}>
            &#x229f; {this.props.name}</legend>
          <GithubFileView {...this.props} />
        </fieldset>
      );
    }
    else {
      return (
        <div
          className="card-disclosure card-disclosure-collapsed card-disclosure-outer"
          onClick={() => this.setState({expanded: true})}>
          &#x229e; {this.props.name}</div>
      );
    }
  }

  state = {
    expanded: false,
  }
}

class GithubFileReadViewParagraph extends React.Component {
  render() {
    return <div className="para">
      {this.props.children}
    </div>;
  }
}

function findRepoName() {
  var match = location.href.match(/^https?:\/\/(\w+)\.github\.io\/(\w+)/);
  if (match) {
    return `${match[1]}/${match[2]}`;
  }

  if (localStorage["szhu.qa.repoName"]) {
    return localStorage["szhu.qa.repoName"];
  }

  throw `No repo set. Set one as follows: localStorage["szhu.qa.repoName"] = "your/repo"`;
}

function main(repo, el) {
  var github = window.github = new Github();
  github.accessToken = localStorage["szhu.qa.login"];

  ReactDOM.render(
    <GithubFileView
      repo={findRepoName()}
      filepath="howto/index.md"
      github={github} />,
    document.getElementById("react-root"));,
  );
}

$(main);
