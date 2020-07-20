// npm install express --save  npm install mongoose --save // git init, npm install body-parser --save, npm install nodemon --save-dev
const express = require('express');
const app = express();
const port = 5000;
const { User } = require("./models/User");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require("./config/key");

//application/x-wwww-form-urlencoded 해석
app.use(bodyParser.urlencoded({extended: true}));

//application/json 해석
app.use(bodyParser.json());

mongoose.connect(config.mongoURI, {
    useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connect ....'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello'))


//회원가입
app.post('/api/users/register', (req, res) => {
    //회원 가입할때 필요한 정보들을 client에 가져온다
    // 그것들을 데이터베이스에 넣어준다
    
      const user = new User(req.body)
      //save전에 암호화 
      user.save((err, userInfo) => {
        //에러 출력
        if(err) return res.json ({ success: false, err})
        return res.status(200).json({   //status 200은 성공했다는 뜻임
          success: ture
        })
      })
    }) 

app.listen(port, () => console.log(`Example app listening on port ${port}`))