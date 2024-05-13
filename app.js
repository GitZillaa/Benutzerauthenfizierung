//app.js
const express = require('express');
const session = require('express-session');

const app = express();
const port = 3000;

app.use(require('body-parser').urlencoded({ extended: false}));
app.use(express.static('public'));

// setting the session middleware
app.use(session({
    secret: 'gfg-key',
    resave: false,
    saveUninitialized: true
}));

// users
const users = {
    'admin' : 'pwd123',
    'user'  :  'hacku'
}

// get session in the /get route
app.get('/get', (req, res) => {
    // retrieve the session variable
    const user = req.session.user || 'No session set';
    res.send(`Session variable: ${user}`);
});

// login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // TODO: REMOVE LOGS
    console.log(username);
    console.log(password);
    if (users[username] && users[username] === password) {
        req.session.user = username;
        res.send(`Hey Geek! Session is set! Now Go to 
		<a href="/get">/get</a> to retrieve the session.`);
    } else {
        res.status(401).send('Invalid Login!');
      }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send('logout erfolgreich');
});

module.exports = app;