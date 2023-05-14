process.env.NODE_ENV = 'test';

import { should as _should } from 'chai';
import chaiHttp from 'chai-http';
import chai from 'chai';
import { app } from '../server.js';
const expect = chai.expect;
chai.use(chaiHttp);

describe('Admin Login API', function() {
    // Admin login test
    it('should return a token when admin logs in', function(done) {
      chai.request(app)
        .post('/api/users/login')
        .send({ 'email': 'admin@gmail.com', 'password': 'test' })
        .end(function(err, res) {
          if (err) console.log('Unable to login test user: ', err);

          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('token');
          done();
        });
    });
  });

describe('Admin Get all users API', function() {
    let adminToken; // Declare adminToken here so it can be accessed in before hook and all tests
    const adminCredentials = { 'email': 'admin@gmail.com', 'password': 'test' }; // Hardcoded admin credentials for demo purposes
  
    before(function(done) {
        chai.request(app)
        .post('/api/users/login')
        .send(adminCredentials)
        .end(function(err, res) {
          adminToken = res.body.token; // Store token in adminToken variable
          done();
        });
    });
  
    // Get all users test
    it('should return all users when requested by admin', function(done) {
      chai.request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer ' + adminToken)
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.be.above(0);
          done();
        });
    });
  
  });

describe('users', ()=>{
    describe('/POST /users/login', (done)=>{
        let userCredentials = { 'email': 'donkey@gmail.com', 'password': 'vikky' }
        it('it should NOT LOGIN using the wrong credentials', (done)=>{
            chai.request(app)
                .post('/api/users/login')
                .send(userCredentials)
                .end((err, res)=>{
                    expect(res).to.have.status(400);      
                    done();
                });
        });

        it('it should LOGIN using the correct credentials', (done)=>{
        let userCredentials = { 'email': 'vikky@gmail.com', 'password': 'vikky' }
            chai.request(app)
                .post('/api/users/login')
                .send(userCredentials)
                .end((err, res)=>{
                    expect(res).to.have.status(200);                    
                    done();
                });
        });
    });        
});