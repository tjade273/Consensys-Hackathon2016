module.exports = {
  build: {
    "index.html": "index.html",
    "async.js": [
      "javascripts/async.js"
    ],
    "app.js": [
      "javascripts/app.js"
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "images/": "images/"
  },
  deploy: [
    "ProofLib",
    "RNG",

  ],
  rpc: {
    host: "localhost",
    port: 8545
  }
};
