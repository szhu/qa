import React from "react";

import "App.css";

import GithubFileView from "components/GithubFileView";
import findRepoName from "util/findRepoName";
import Github from "util/Github";

let github = new Github();
github.accessToken = localStorage["szhu.qa.login"];

let repoName = findRepoName();

class App extends React.Component {
  render() {
    return (
      <GithubFileView
        repo={repoName}
        filepath="docs/index.md"
        github={github}
      />
    );
  }
}

export default App;
