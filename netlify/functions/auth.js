const https = require("https");
const querystring = require("querystring");

exports.handler = function (event, context, callback) {
  if (event.httpMethod !== "GET") {
    return callback(null, { statusCode: 405, body: "Method Not Allowed" });
  }

  const clientId = process.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    return callback(null, {
      statusCode: 500,
      body: "OAUTH_CLIENT_ID is not configured",
    });
  }

  const params = querystring.stringify({
    client_id: clientId,
    scope: "repo,user",
    redirect_uri: "https://abuuatwiyyah.netlify.app/callback",
  });

  return callback(null, {
    statusCode: 302,
    headers: {
      Location: "https://github.com/login/oauth/authorize?" + params,
      "Cache-Control": "no-cache",
    },
    body: "",
  });
};
