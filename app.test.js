const supertest = require('supertest');
const app = require('./app');


// test no session set
test("GET /get", done => {
  supertest(app)
    .get("/get")
    .expect(200, "Session variable: No session set")
    .end(done)
})

// test wrong credentials, existing user
test("POST /login", done => {
  supertest(app)
    .post('/login')
    .send("username=oser&password=dacku")
    .expect(401)
    .end(done)
})

// test right credentials, existing user
test("POST /login", done => {
  supertest(app)
    .post('/login')
    .send("username=user&password=hacku")
    .expect(200)
    .end(done)
})

// test logged in user
test('GET /get', done => {
  supertest(app)
    .get('/get')
    .set('Accept', 'text/html')
    .expect(response => {
        expect(response.text).toEqual('Session variable: No session set');
      })
    .end(done);

});


// // 3. logout
