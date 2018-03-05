interface Window {
  qaLocalConfig?: LocalConfig;
}

interface LocalConfig {
  useMockGithubApi: boolean;
}

const DEFAULT_LOCAL_CONFIG = {
  useMockGithubApi: false,
};

export default function getLocalConfig(): LocalConfig {
  let localConfig = (window as Window).qaLocalConfig;
  if (localConfig) {
    return localConfig;
  } else {
    return DEFAULT_LOCAL_CONFIG;
  }
}
