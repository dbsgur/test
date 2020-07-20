// npm install express --save  npm install mongoose --save // git init
const express = require('express');
const app = express();
const port = 5000;

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connect ....'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello'))

app.listen(port, () => console.log(`Example app listening on port ${port}`))