// This is an example of an environment file. This file should be copied to a
// new file, called "environment.mjs," and then it can be invoked as such:
//
// include config from "./environment";
//
// which provides the config object, so the apiKey can be gotten via:
//
// config().newsApiKey

export default function() {
  return {
    newsApiKey: "4e644322efd847f1b617f85487feb1c6"
  };
};
