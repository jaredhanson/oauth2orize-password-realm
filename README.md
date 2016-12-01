# oauth2orize-password-realm

[![Build](https://img.shields.io/travis/jaredhanson/oauth2orize-password-realm.svg)](https://travis-ci.org/jaredhanson/oauth2orize-password-realm)
[![Coverage](https://img.shields.io/coveralls/jaredhanson/oauth2orize-password-realm.svg)](https://coveralls.io/r/jaredhanson/oauth2orize-password-realm)
[![Quality](https://img.shields.io/codeclimate/github/jaredhanson/oauth2orize-password-realm.svg?label=quality)](https://codeclimate.com/github/jaredhanson/oauth2orize-password-realm)
[![Dependencies](https://img.shields.io/david/jaredhanson/oauth2orize-password-realm.svg)](https://david-dm.org/jaredhanson/oauth2orize-password-realm)


Password exchange with realm support for [OAuth2orize](https://github.com/jaredhanson/oauth2orize).

This exchange is used to exchange a password credential for an access token.
This is similar in functionality to the standard [Resource Owner Password Credentials Grant](https://tools.ietf.org/html/rfc6749#section-4.3)
defined by [OAuth 2.0](https://tools.ietf.org/html/rfc6749), but includes the
ability to indicate a specific realm.

Realms in this exchange are intended to be used identically to that of [HTTP Authentication](https://tools.ietf.org/html/rfc7235),
where realms allow a server to be partitioned into a set of [protection spaces](https://tools.ietf.org/html/rfc7235#section-2.2), each
with its own authorization database.

## Install

```bash
$ npm install oauth2orize-password-realm
```

## Usage

#### Register Exchange

Register the exchange with an OAuth 2.0 server.

```javascript
var password = require('oauth2orize-password-realm').exchange.password;

server.exchange('http://auth0.com/oauth/grant-type/password-realm', password(function(client, username, password, realm, scope, done) {
  // verify password and issue access token
  var token = 'secret';
  return done(null, token);
});
```

#### Exchange Password for Access Token

```
POST /token HTTP/1.1
Host: server.example.com
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW
Content-Type: application/x-www-form-urlencoded

grant_type=http%3A%2F%2Fauth0.com%2Foauth%2Fgrant-type%2Fpassword-realm&username=johndoe&password=A3ddj3w&realm=users
```

## Considerations

#### Realms

Realms are used to allow a server to be partitioned into a set of protection
spaces, each with its own authentication scheme and/or authorization database.

One use case for this is when a company maintains separate user directories, for
example one directory for employees and another for customers.  An application
that allows both empolyees and customers to log in can present a user interface
with a dropdown containing "Employees" or "Customers" as realms.  The realm
value, along with the username and password credentials, is then submitted to
the token endpoint.  The authorization server would use the realm value to
determine which directory to use when verifying the password.

#### Relation to Resource Owner and Client Credentials

The functionality of this exchange overlaps to some degree with both the [Resource Owner Password Credentials Grant](https://tools.ietf.org/html/rfc6749#section-4.3)
and the [Client Credentials Grant](https://tools.ietf.org/html/rfc6749#section-4.4)
defined by OAuth 2.0, in that both allow a password credential to be exchanged
for an access token.  The former allows a resource owner (typically a user) to
obtain an access token, while the latter allows a client to exchange its client
secret for an access token.

This exchange offers a more general form of password exchange, and could be used
as an alternative, unified implementation where the two types of entities are divided
into unique realms (for example, `users` and `clients`).

For compatibility, it is recommended to continue to support both `password` and
`client_credentials` exchanges.  If additional entities, such as resource
servers, need to be able to obtain access tokens, implementing this exchange
offers more flexibility.


## Contributing

#### Tests

The test suite is located in the `test/` directory.  All new features are
expected to have corresponding test cases.  Ensure that the complete test suite
passes by executing:

```bash
$ make test
```

#### Coverage

All new feature development is expected to have test coverage.  Patches that
increse test coverage are happily accepted.  Coverage reports can be viewed by
executing:

```bash
$ make test-cov
$ make view-cov
```


## Sponsors

This project is sponsored by [Auth0](https://auth0.com/).


## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2016 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
