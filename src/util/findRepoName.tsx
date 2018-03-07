import getLocalConfig from "util/LocalConfig";

export default function findRepoName() {
  if (getLocalConfig().useMockGithubApi) {
    return "local/repo";
  } else {
    let match = location.href.match(/^https?:\/\/(\w+)\.github\.io\/(\w+)/);
    if (match) {
      return `${match[1]}/${match[2]}`;
    }

    if (localStorage["szhu.qa.repoName"]) {
      return localStorage["szhu.qa.repoName"];
    }

    throw `No repo set. Set one as follows: localStorage["szhu.qa.repoName"] = "your/repo"`;
  }
}
