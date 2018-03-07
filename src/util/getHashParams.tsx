interface ReturnValue {
  [x: string]: string | undefined;
  urlWithoutHash: string;
}

export default function getHashParams(url: string | undefined): ReturnValue {
  if (!url) {
    return {
      urlWithoutHash: ""
    };
  }
  let hashMatch = url.match(/^([^#]*)#(.*)$/);
  if (!hashMatch) {
    return {
      urlWithoutHash: url
    };
  }

  // https://stackoverflow.com/a/21152762/782045
  let data = {
    urlWithoutHash: hashMatch[1]
  };
  let query = hashMatch[2];
  for (let item of query.split("&")) {
    let kvMatch = item.match(/^([^=]*)=(.*)$/);
    if (!kvMatch) {
      continue;
    }
    let [key, val] = kvMatch.slice(1).map(decodeURIComponent);
    data[key] = val;
  }
  return data;
}
