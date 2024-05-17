// tests/login.test.js
const request = require('supertest');
const app = require('./app');

describe('Login Tests with Persistent Cookies', () => {
  const agent = request.agent(app);  // Create an agent to persist cookies

  test('GET /get and check session username', async () => {
    let response = await agent
      .get('/get')
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual('Session variable: No session set');
   });

  test('POST /login and maintain session', async () => {
    let response = await agent
      .post('/login')
      .send('username=user&password=hacku')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    expect(response.statusCode).toBe(200);
    //expect(response.text).toEqual('Login erfolgreich');
   });

   test('GET /get and check session username', async () => {
    let response = await agent
      .get('/get')
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual('Session variable: user');
   });

  test('GET /logout should clear the session', async () => {
    await agent.post('/login')
      .send('username=user&password=hacku')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    
    let response = await agent.get('/logout');
    expect(response.text).toEqual('logout erfolgreich');
  });

  test('GET /get and check session username', async () => {
    let response = await agent
      .get('/get')
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual('Session variable: No session set');
   });
});