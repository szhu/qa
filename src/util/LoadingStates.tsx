import React from "react";

export interface Value {
  id: string;
  hasContent: boolean;
  shouldShowEditor: boolean;
  message?: () => React.ReactNode;
  transitions: {
    startLoad: () => Value;
  };
}

export let INITIAL: Value;
export let LOADING: Value;
export let LOADED: Value;
export let RELOADING: Value;
export let LOAD_FAILED_401: Value;
export let LOAD_FAILED_404: Value;

INITIAL = {
  id: "INITIAL",
  hasContent: false,
  shouldShowEditor: false,
  transitions: {
    startLoad: () => LOADING
  }
};

LOADING = {
  id: "LOADING",
  hasContent: false,
  shouldShowEditor: false,
  message: () => {
    return <span>Loading…</span>;
  },
  transitions: {
    startLoad: () => LOADING
  }
};

LOADED = {
  id: "LOADED",
  hasContent: true,
  shouldShowEditor: true,
  transitions: {
    startLoad: () => RELOADING
  }
};

RELOADING = {
  id: "RELOADING",
  hasContent: true,
  shouldShowEditor: true,
  message: () => {
    return <span>Loading…</span>;
  },
  transitions: {
    startLoad: () => RELOADING
  }
};

LOAD_FAILED_401 = {
  id: "LOAD_FAILED_401",
  hasContent: false,
  shouldShowEditor: false,
  message: () => {
    return (
      <div>
        <div>
          The GitHub API returned a 401 Unauthorized error. Your login might be
          invalid.
        </div>
        <div>
          <input
            type="button"
            onClick={() => (localStorage["szhu.qa.login"] = "")}
            value="Click here"
          />{" "}
          to log out.
        </div>
        <div>Then refresh the page.</div>
      </div>
    );
  },
  transitions: {
    startLoad: () => LOADING
  }
};

LOAD_FAILED_404 = {
  id: "LOAD_FAILED_404",
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
    startLoad: () => LOADING
  }
};
