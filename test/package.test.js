/* global describe, it */

var pkg = require('..');
var expect = require('chai').expect;


describe('oauth2orize-password-realm', function() {
  
  it('should export exchanges', function() {
    expect(pkg.exchange).to.be.an('object');
    expect(pkg.exchange.password).to.be.a('function');
  });
  
});
