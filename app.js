//app.js
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const User = require('./models/User')
require('dotenv').config();


const app = express();
const port = 3000;


app.use(require('body-parser').urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.json())

mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to Mongo!');
    })
    .catch((err) => {
        console.error('Error connecting to Mongo', err);
    });

app.use(session({
    secret: 'geheim',
    resave: false,
    saveUninitialized: true
}))

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.create({ username, email, password });
        res.status(201).send({ massage: "User erfogreich angelegt", user })
    } catch (error) {
        res.status(500).send({ massage: "Fehler beim Anlegen des Users", error })
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password, user.password))) {
        return res.status(401).send({ message: 'Incorrect email or password' });
      }
      req.session.user = user;
      res.send({ message: "Logged in successfully" });
    } catch (error) {
      res.status(500).send({ message: "Login error", error });
    }
  });

// setting the session middleware
app.use(session({
    secret: 'gfg-key',
    resave: false,
    saveUninitialized: true
}));

// users
// const u sers = {
//     'admin': 'pwd123',
//     'user': 'hacku'
// }

// get session in the /get route
app.get('/get', (req, res) => {
    // retrieve the session variable
    const user = req.session.user || 'No session set';
    res.send(`Session variable: ${user}`);
});

// login route
// app.post('/login', (req, res) => {
//     const { username, password } = req.body;
//     // TODO: REMOVE LOGS
//     console.log(username);
//     console.log(password);
//     if (users[username] && users[username] === password) {
//         req.session.user = username;
//         res.send(`Hey Geek! Session is set! Now Go to 
// 		<a href="/get">/get</a> to retrieve the session.`);
//     } else {
//         res.status(401).send('Invalid Login!');
//     }
// });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.send({ message: "Erfogreich ausgelogged" });
  });

module.exports = app;