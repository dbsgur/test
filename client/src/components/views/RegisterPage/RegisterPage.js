import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';



function RegisterPage(props) {
    
    const dispatch = useDispatch();
    
    const [Member, setMember] = useState("")
    const [Password, setPassword] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")
    const [Phone, setPhone] = useState("")
    const [Nickname, setNickname] = useState("")
    const [Gender, setGender] = useState("")

    const onMemberHandler = (event) => {
        setMember(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value)
    }

    const onPhoneHandler = (event) => {
        setPhone(event.currentTarget.value)
    }

    const onNicknameHandler = (event) => {
        setNickname(event.currentTarget.value)
    }

    const onGenderHandler = (event) => {
        setGender(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault(); //안해주고 로그인을 하면 페이지가 리프레쉬가 됨

        if(Password !== ConfirmPassword) {
            return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
        }

        let body = {
            member : Member,
            password : Password,
            phoen : Phone,
            nickname: Nickname,
            gender : Gender
        }
        //입렵값 백엔드로 보내주는 부분 action gogo
        dispatch(registerUser(body))
            .then(response => {
                if(response.payload.success) {
                    props.history.push('/login')
                }else{
                    alert("Failed to sign up")
                }
            })
        
    }
    
    return (
        <div style ={{ display:'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height:'100vh'}}>
        <form style ={{ display: 'flex', flexDirection: 'column'}} onSubmit={onSubmitHandler}>
            <label>ID</label>
            <input type = "text" value ={Member} onChange={onMemberHandler} />

            <label>Password</label>
            <input type = "password" value = {Password} onChange={onPasswordHandler} />

            <label>Confirm Password</label>
            <input type = "password" value ={ConfirmPassword} onChange={onConfirmPasswordHandler} />

            <label>별명</label>
            <input type = "text" value ={Nickname} onChange={onNicknameHandler} />

            <label>Cell phone Number</label>
            <input type = "text" value ={Phone} onChange={onPhoneHandler} />

            <label>gender</label>
            <input type = "text" value ={Gender} onChange={onGenderHandler} />
            <br/>
            <button type="submit">
                회원가입
            </button>
        </form>
    </div>
    )
}

export default RegisterPage
