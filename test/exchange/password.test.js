var chai = require('chai')
  , password = require('../../lib/exchange/password');


describe('exchange.password', function() {
  
  it('should be named password_realm', function() {
    expect(password(function(){}).name).to.equal('password_realm');
  });
  
});
