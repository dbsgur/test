import React, { useState } from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';



export default function LoginPage(props) {
    const dispatch = useDispatch();
    const [Member, setmember] = useState("")
    const [Password, setpassword] = useState("")

    const onMemberHandler = (event) => {

        setmember(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {

        setpassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefalut(); //안해주고 로그인을 하면 페이지가 리프레쉬가 됨

        let body = {
            member : Member,
            password : Password
        }
        //입렵값 백엔드로 보내주는 부분 action gogo
        dispatch(loginUser(body))
            .then(response => {
                if(response.payload.loginSuccess) {
                    props.history.push('/')
                }else {
                    alert('error')
                }
            })
        
    }
    
  return (
    <div style ={{ display:'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height:'100vh'}}>
        <form style ={{ display: 'flex', flexDirection: 'column'}} onSubmit={onSubmitHandler}>
            <label>ID</label>
            <input type = "member" value ={Member} onChange={onMemberHandler} />
            <label>Password</label>
            <input type = "password" value = {Password} onChange={onPasswordHandler} />
            <br/>
            <button type="submit">
                Login
            </button>
        </form>
    </div>
  );
}