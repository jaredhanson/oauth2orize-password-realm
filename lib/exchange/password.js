/**
 * Module dependencies.
 */
var merge = require('utils-merge')
  , TokenError = require('../errors/tokenerror');


module.exports = function(options, issue) {
  if (typeof options == 'function') {
    issue = options;
    options = undefined;
  }
  options = options || {};

  if (!issue) { throw new TypeError('oauth2orize-password-realm exchange requires an issue callback'); }

  var userProperty = options.userProperty || 'user';

  // For maximum flexibility, multiple scope spearators can optionally be
  // allowed.  This allows the server to accept clients that separate scope
  // with either space or comma (' ', ',').  This violates the specification,
  // but achieves compatibility with existing client libraries that are already
  // deployed.
  var separators = options.scopeSeparator || ' ';
  if (!Array.isArray(separators)) {
    separators = [ separators ];
  }

  return function password_realm(req, res, next) {
    if (!req.body) { return next(new Error('OAuth2orize requires body parsing. Did you forget to use body-parser middleware?')); }
    
    // The 'user' property of `req` holds the authenticated user.  In the case
    // of the token endpoint, the property will contain the OAuth 2.0 client.
    var client = req[userProperty]
      , username = req.body.username
      , passwd = req.body.password
      , realm = req.body.realm
      , scope = req.body.scope;
      
    if (!username) { return next(new TokenError('Missing required parameter: username', 'invalid_request')); }
    if (!passwd) { return next(new TokenError('Missing required parameter: password', 'invalid_request')); }
    if (!realm) { return next(new TokenError('Missing required parameter: realm', 'invalid_request')); }
    
    if (scope) {
      for (var i = 0, len = separators.length; i < len; i++) {
        var separated = scope.split(separators[i]);
        // only separate on the first matching separator.  this allows for a sort
        // of separator "priority" (ie, favor spaces then fallback to commas)
        if (separated.length > 1) {
          scope = separated;
          break;
        }
      }
      if (!Array.isArray(scope)) { scope = [ scope ]; }
    }
    
    function issued(err, accessToken, refreshToken, params) {
      if (err) { return next(err); }
      if (!accessToken) { return next(new TokenError('Invalid resource owner credentials', 'invalid_grant')); }
      if (refreshToken && typeof refreshToken == 'object') {
        params = refreshToken;
        refreshToken = null;
      }
      
      var tok = {};
      tok.access_token = accessToken;
      if (refreshToken) { tok.refresh_token = refreshToken; }
      if (params) { merge(tok, params); }
      tok.token_type = tok.token_type || 'Bearer';
      
      var json = JSON.stringify(tok);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Pragma', 'no-cache');
      res.end(json);
    }

    try {
      var arity = issue.length;
      if (arity == 7) {
        issue(client, username, passwd, realm, scope, req.body, req.authInfo, issued);
      } else if (arity == 6) {
        issue(client, username, passwd, realm, scope, req.body, issued);
      } else if (arity == 5) {
        issue(client, username, passwd, realm, scope, issued);
      } else { // arity == 4
        issue(client, username, passwd, realm, issued);
      }
    } catch (ex) {
      return next(ex);
    }
  };
};
