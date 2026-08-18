const https = require("https");
const querystring = require("querystring");

exports.handler = async (event, context) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const clientId = process.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    return { statusCode: 500, body: "OAUTH_CLIENT_ID is not configured" };
  }

  const params = querystring.stringify({
    client_id: clientId,
    scope: "repo,user",
    redirect_uri: "https://abuuatwiyyah.netlify.app/callback",
  });

  return {
    statusCode: 302,
    headers: {
      Location: "https://github.com/login/oauth/authorize?" + params,
      "Cache-Control": "no-cache",
    },
    body: "",
  };
};
