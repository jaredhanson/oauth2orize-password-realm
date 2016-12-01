var chai = require('chai')
  , password = require('../../lib/exchange/password');


describe('exchange.password', function() {
  
  it('should be named password_realm', function() {
    expect(password(function(){}).name).to.equal('password_realm');
  });
  
  it('should throw if constructed without a issue callback', function() {
    expect(function() {
      password();
    }).to.throw(TypeError, 'oauth2orize.password_realm exchange requires an issue callback');
  });
  
  describe('issuing an access token', function() {
    var response, err;

    before(function(done) {
      function issue(client, username, passwd, realm, done) {
        if (client.id !== 'c123') { return done(new Error('incorrect client argument')); }
        if (username !== 'bob') { return done(new Error('incorrect username argument')); }
        if (passwd !== 'shh') { return done(new Error('incorrect passwd argument')); }
        
        return done(null, 's3cr1t')
      }
      
      chai.connect.use(password(issue))
        .req(function(req) {
          req.user = { id: 'c123', name: 'Example' };
          req.body = { username: 'bob', password: 'shh', realm: 'users' };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
    it('should respond with headers', function() {
      expect(response.getHeader('Content-Type')).to.equal('application/json');
      expect(response.getHeader('Cache-Control')).to.equal('no-store');
      expect(response.getHeader('Pragma')).to.equal('no-cache');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal('{"access_token":"s3cr1t","token_type":"Bearer"}');
    });
  });
  
});
