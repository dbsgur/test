var mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const saltRounds = 10;
//const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    member: {
        type: String,
        maxlength: 20,
        unique: 1
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 20
    },
    nickname: {
        type: String,
        minlength: 1,
        maxlength: 12,
        unique: 1
    },
    phone: {
        type: String,
        maxlength: 11,
        unique: 1,
        trim: true
    },
    gender: {
        type: String
    },
    role: {
        type: Number,
        default: 6647
    },
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

//비밀번호 암호화
userSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcrpyt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            bcrpyt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    }else {
        next()
    }
})

//비밀번호 비교 스키마 comparePassword 함수명  plainPassword는 사용자가 입력한 password cb는 콜백함수 암호화된 password
userSchema.methods.comparePassword = function(plainPassword, cb){
    bcrpyt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err),
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    //토큰 생성 secretToken 변수
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    //토큰을 decode한다
    jwt.verify(token, 'secretToken', function(err, decoded) {
        //사용자 아이디를 이용해서 사용자를 찾은 다음 
        // 클라이언트에서 가져온 토큰과 디비에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id": decoded, "token" : token}, function(err, user) {
            if(err) return cb(err);
            cb(null, user)
        })
    })
}


const User = mongoose.model('User', userSchema)

module.exports = { User }