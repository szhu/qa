import React from "react";
import Github from "util/Github";

import getLocalConfig from "util/LocalConfig";

interface Props {
  github: Github;
  className: string; // TODO: find built-in way to allow splat props
}

interface State {
  user: {
    name?: string;
    avatar_url?: string;
    login?: string;
  };
  userInputName: string | undefined;
  userInputEmail: string | undefined;
  primaryEmail: string | undefined;
}

class GithubLoginInfo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      user: {},
      userInputName: undefined,
      userInputEmail: undefined,
      primaryEmail: undefined,
    };
  }

  render() {
    if (getLocalConfig().useMockGithubApi) {
      return this.renderMock();
    } else {
      return this.renderReal();
    }
  }

  renderMock() {
    return "Loading and saving from local server. This tool may be unreliable, so please keep backups by commiting your content often!";
  }

  renderReal() {
    return (
      <span {...this.props}>
        Signed in as
        <span>{" "}</span>
        <img
          className="github-user-avatar"
          src={this.state.user.avatar_url && `${this.state.user.avatar_url}&s=32`}
        />
        <span>{" "}</span>
        <span
          className="github-user-login"
        >
          {this.state.user.login}
        </span>
        <span>{" "}</span>
        <input
          className="github-user-name"
          type="text"
          placeholder="Committer Name"
          value={this.state.userInputName || this.state.user.name || ""}
          onChange={(event) => this.setState({userInputName: event.target.value})}
        />
        <input
          className="github-user-email"
          type="email"
          placeholder="Committer email"
          value={this.state.userInputEmail || this.state.primaryEmail || ""}
          onChange={(event) => this.setState({userInputEmail: event.target.value})}
        />
      </span>
    );
  }

  componentWillMount() {
    // if (window.qaLocalConfig && window.qaLocalConfig.useMockGithubApi) {
    //   return;
    // }

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
    interface UserEmail {
      primary: boolean;
      email: string;
    }
    const emails: UserEmail[] = await this.props.github.request(
      "GET", "/user/emails"
    );
    this.setState({
      primaryEmail: emails.filter((emailObj) => emailObj.primary)[0].email,
    });
  }

  get userName(): string | undefined {
    return this.state.userInputName || this.state.user.name;
  }

  get userEmail(): string | undefined {
    return this.state.userInputEmail || this.state.primaryEmail;
  }
}

export default GithubLoginInfo;
