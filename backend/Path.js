exports.buildPath = function (route) {
    if (process.env.NODE_ENV === "production") {
      // console.log("Request in production mode.");
      // environment port, specified in dockerfile
      // let port = process.env.REACT_APP_API_PORT;
      // let hostname = window.location.hostname;
      return process.env.PUBLIC_URL + route;
    } else {
      // Development
      // console.log("Request in dev mode.");
      return "http://localhost:" + process.env.PORT + route;
    }
  };