import $ from "jquery";
import utf8 from "utf8";

import getLocalConfig from "util/LocalConfig";

class Github {
  accessToken?: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  canEdit() {
    if (getLocalConfig().useMockGithubApi) {
      return true;
    }

    if (this.accessToken) {
      return true;
    }

    return false;
  }

  request(method: string, path: string, dataObject?: {}) {
    return $.ajax({
      type: method,
      url: (getLocalConfig().useMockGithubApi)
        ? "api" + path
        : "https://api.github.com" + path,
      headers: {
        "Authorization": this.accessToken ? `Bearer ${this.accessToken}` : undefined,
        "Accept": "application/vnd.github.v3+json",
      },
      contentType: "application/json",
      data: (method === "GET")
        ? dataObject
        : JSON.stringify(dataObject),
    });
  }
}

export function encodeContent(normalString: string) {
  return btoa(utf8.encode(normalString));
}

export function decodeContent(encodedString: string) {
  return utf8.decode(atob(encodedString));
}

export default Github;
