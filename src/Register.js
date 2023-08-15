import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import axios from './api/axios';

const USER_REGEX = /^[a-zA-z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register'

const Register = () => {

    const userRef = useRef()
    const errRef = useRef()

    const [user, setUser] = useState("")
    const [validName, setValidName ] = useState(false)
    const [userFocus, setUserFocus] = useState(false)

    const [pwd, setPwd] = useState("")
    const [validPwd, setValidPwd ] = useState(false)
    const [pwdFocus, setPwdFocus] = useState(false)

    const [matchPwd  , setMatchPwd] = useState("")
    const [validMatch, setValidMatch ] = useState(false)
    const [matchFocus, setMatchFocus] = useState(false)

    const [errMsg, setErrMsg] = useState("")
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        const result = USER_REGEX.test(user)
        // console.log(result)
        // console.log(user)
        setValidName(result)
    }, [user])

    useEffect(() => {
        const result = PWD_REGEX.test(pwd)
        // console.log(result)
        // console.log(pwd)
        setValidPwd(result)
        const match = pwd === matchPwd
        setValidMatch(match)
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('')
    }, [user, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        //if button is enabled with JS hack
        const v1 = USER_REGEX.test(user)
        const v2 = PWD_REGEX.test(pwd)

        if (!v1 || !v2) {
            setErrMsg("Invalid Entry")
            return
        }      

        try {
            // const response = await axios.post(REGISTER_URL,
            //     JSON.stringify({ user, pwd }),
            //     {
            //         headers: { 'Content-Type': 'application/json' },
            //         withCredentials: true
            //     }
            // )
            // console.log(response.data)
            // console.log(response.accessToken)
            // console.log(JSON.stringify(response))
            setSuccess(true)
            // clear input fields

        } catch (err) {
            if (!err?.response) {
                setErrMsg('No server Response')
            } else if (err.response?.status === 409) {
                setErrMsg('Username taken')
            } else {
                setErrMsg('Registration failed')
            }
            errRef.current.focus() // for screenreaders
        }
        
    }


    return (
      <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <Link to='/login'>Sign In</Link>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        {/*  USERNAME */}
                        <label htmlFor='username'>
                            Username:
                            <span className={validName ? "valid" : "hide"}>
                                <i className="fa-solid fa-check"></i>
                            </span>
                            <span className={validName || !user ? "hide" : "invalid"}>
                                <i className="fa-solid fa-x"></i>
                            </span>
                        </label>
                            
                        <input
                            type='text'
                            id='username'
                            ref={userRef}
                            autoComplete='off'
                            onChange={(e) => setUser(e.target.value)}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby='uidnote'
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                            <i className="fa-solid fa-circle-info"></i>
                            4 to 24 characters. <br />
                            Must begin with a letter. <br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>
                            {/* PASSWORD */}
                        <label htmlFor="password">
                            Password:
                            <i className={validPwd ? "fa-solid fa-check valid" : "hide"} />
                            <i className={validPwd || !pwd ? "hide" : "invalid fa-solid fa-x"} />
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <i className='fa-solid fa-circle-info' />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>
                        {/* CONFIRM PASSWORD */}
                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                            <i className={validMatch && matchPwd ? "valid fa-solid fa-check" : "hide"} />
                            <i className={validMatch || !matchPwd ? "hide" : "invalid fa-solid fa-x"} />
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <i className='fa-solid fa-circle-info' />
                            Must match the first password input field.
                        </p>
                        <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
                    </form>
                    <p>
                        Already registered?<br />
                        <span className="line">
                            {/*put router link here*/}
                            <Link  to="/login">Sign In</Link >
                        </span>
                    </p>
                </section>
            )} 

            </>
      
  )
}

export default Register