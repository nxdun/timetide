import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/server.js'; // Assuming your Express app is exported as 'app'
// Extend chai with chai-http
chai.use(chaiHttp);

describe('POST /login', () => {
    it('should return 400 if user is already logged in', (done) => {
      chai.request(app)
        .post('/login')
        .set('Cookie', 'auth=token') // Set the auth cookie to simulate logged in user
        .send({ username: 'testuser', password: 'testpassword' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message', 'User already logged in');
          done();
        });
    });
  
    it('should return 400 if username or password is missing', (done) => {
      chai.request(app)
        .post('/login')
        .send({ username: 'testuser' }) // Missing password
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message', 'All fields are required');
          done();
        });
    });
  
    it('should return 400 if username or password is incorrect', (done) => {
      chai.request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'wrongpassword' }) // Incorrect password
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message', 'Invalid credentials');
          done();
        });
    });
  
    it('should return 200 with JWT token if username and password are correct', (done) => {
      chai.request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'testpassword' }) // Correct username and password
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Login successful');
          expect(res.body).to.have.property('token'); // Assuming the response includes the token
          done();
        });
    });
  });