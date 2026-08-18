const https = require("https");
const querystring = require("querystring");

exports.handler = function (event, context, callback) {
  if (event.httpMethod !== "GET") {
    return callback(null, { statusCode: 405, body: "Method Not Allowed" });
  }

  const code = event.queryStringParameters && event.queryStringParameters.code;
  if (!code) {
    return callback(null, {
      statusCode: 400,
      body: "Missing code query parameter",
    });
  }

  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return callback(null, {
      statusCode: 500,
      body: "OAuth client credentials are not configured",
    });
  }

  const postBody = querystring.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
  });

  const options = {
    hostname: "github.com",
    port: 443,
    path: "/login/oauth/access_token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postBody),
      Accept: "application/json",
    },
  };

  const req = https.request(options, function (res) {
    let data = "";
    res.setEncoding("utf8");
    res.on("data", function (chunk) {
      data += chunk;
    });
    res.on("end", function () {
      let token;
      try {
        token = JSON.parse(data).access_token;
      } catch (e) {
        return callback(null, {
          statusCode: 500,
          body: "Failed to parse token response",
        });
      }
      if (!token) {
        return callback(null, {
          statusCode: 500,
          body: "No access_token in response",
        });
      }

      const safeToken = token.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      const page =
        "<!DOCTYPE html>\n" +
        "<html>\n" +
        "<head><title>Authorization</title></head>\n" +
        "<body>\n" +
        "<script>\n" +
        "  (function() {\n" +
        "    function receiveMessage(e) {\n" +
        "      window.opener.postMessage(\n" +
        "        'authorization:github:success:' + JSON.stringify({ token: \"" +
        safeToken +
        '", provider: "github" }),\n' +
        "        e.origin\n" +
        "      );\n" +
        "      window.removeEventListener(\"message\", receiveMessage, false);\n" +
        "    }\n" +
        "    window.addEventListener(\"message\", receiveMessage, false);\n" +
        '    window.opener.postMessage("authorizing:github", "*");\n' +
        "  })();\n" +
        "</script>\n" +
        "</body>\n" +
        "</html>";

      return callback(null, {
        statusCode: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache",
        },
        body: page,
      });
    });
  });

  req.on("error", function (e) {
    return callback(null, {
      statusCode: 500,
      body: "Token exchange request failed",
    });
  });

  req.write(postBody);
  req.end();
};
