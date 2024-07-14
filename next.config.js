/** @type {import("next").NextConfig} */

// import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
// const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  output: "standalone",
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       stream: require.resolve('stream-browserify'),
  //     };
  //   }

  //   config.plugins.push(new NodePolyfillPlugin());

  //   return config;
  // },
}
