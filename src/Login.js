import React from 'react'
import { useRef, useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom"

import AuthContext from "./context/AuthProvider"
import axios from 'axios';


const LOGIN_URL = '/auth'

const Login = () => {
    const {setAuth} = useContext(AuthContext)
    const userRef = useRef()
    const errRef = useRef()

    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const response = await axios.post(LOGIN_URL, JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                
                }
            )
            
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles
            setAuth({user, pwd, roles, accessToken})
            setUser("")
            setPwd("")
            setSuccess(true)

        } catch (err) {
            if (!err?.response) {
                setErrMsg('No server response')
            } else if (err.response?.status === 400) {
                setErrMsg('Missing username or password')
            } else if (err.response?.status === 401) {
                setErrMsg ('Unauthorized')
            } else {
                setErrMsg('Login Failed')
            }
        }

        
    }
    

    return (
        <> 
            {success ? (
                <section>
                    <h1>You are logged in!</h1>
                    <br />
                    <p>
                        <a href='#'>Go to Home</a>
                    </p>
                </section>
            ) : (            
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live='assertive'>{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor='username'>Username:</label>
                <input
                    type='text'
                    id='username'
                    ref={userRef}
                    autoComplete='off'
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                />
                <label htmlFor='password'>Password:</label>
                <input
                    type='password'
                    id='password'
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <button>Sign in</button>
                <p>
                    Need an Account? <br />
                    <span className='line'>
                        <Link to='/'>Sign up</Link>
                    </span>
                </p>
            </form>
        </section>
        ) }
        </>  
  )
}

export default Login