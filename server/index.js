// npm install express --save  npm install mongoose --save // git init, npm install body-parser --save, npm install nodemon --save-dev, npm install bcrypt --save (비밀번호 암호화)
const express = require('express');
const app = express();
const port = 5000;
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require("./config/key");

//application/x-wwww-form-urlencoded 해석
app.use(bodyParser.urlencoded({ extended: true }));

//application/json 해석
app.use(bodyParser.json());

app.use(cookieParser());

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connect ....'))
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello'))

app.get('/api/hello', (req,res) => {
    res.send("fuck u")
})

//회원가입
app.post('/api/users/register', (req, res) => {
    //회원 가입할때 필요한 정보들을 client에 가져온다
    // 그것들을 데이터베이스에 넣어준다

    const user = new User(req.body)
    //save전에 암호화 
    user.save((err, userInfo) => {
        //에러 출력
        if (err) return res.json({ success: false, err })
        return res.status(200).json({   //status 200은 성공했다는 뜻임
            success: ture
        })
    })
})


//로그인
app.post('/api/users/login', (req, res) => {
    //요청된 아이디를 데이터베이스에 있는지 확인 'user' 변수명
    User.findOne({ member: req.body.member }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "아이디가 없습니다."
            })
        }
        //아이디가 있다면 비번이 맞는지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })

            //비밀번호 맞으면 token 생성  npm install jsonwebtoken --save 해줘야함
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                //토큰을 저장한다. 쿠키 or 로컬 스토리지 등등 지금은 쿠키 ! npm install cookie-parser
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: ture, userId: user._id })
            })
        })
    })
})


//Auth기능 -- 로그인안되면 못보는 페이지 구현
app.get('/api/users/auth', auth, (req, res) => {
    //여기로 들어오면 미들웨어를 통과했다는 얘기 authentication이 true라는 말임
    res.status(200).json({
        _id: req.user._id,
        member: req.user.member,
        isAdmin: req.user.role === 0 ? false : ture,         // role 0 : 일반유저 0이아니면 관리자
        isAuth: true,
        nickname: req.user.nickname,
        phone: req.user.phone,
        gender: req.user.gender,
        role: req.user.role
    })
})

//logout 기능  데이터베이스에서 토큰을 지워준다.
app.get('/api/users/logout', auth, (req, res) => {

    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: ture
        })
    })
})




app.listen(port, () => console.log(`Example app listening on port ${port}`))

