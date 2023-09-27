import React, { useEffect, useRef, useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Messages } from 'primereact/messages';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { apiEndPoint } from './common/config';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const Login = () => {


    const [showRegister, setShowRegister] = useState(false);








    const Register = () => {
        const [userData, setUserData] = useState({
            name: {
                value: "",
                error: "",
                touched: false
            },
            email: {
                value: "",
                error: "",
                touched: false
            },
            password: {
                value: "",
                error: "",
                touched: false
            },
            cpassword: {
                value: "",
                error: "",
                touched: false
            },
            isFormValid: true
        });
        const msgs = useRef(null);

        const validate = (userData) => {

            if (!userData.name.value) {
                userData.name.error = 'Name is required.';
                userData.isFormValid = false;
            }

            if (!userData.email.value) {
                userData.email.error = 'Email is required.';
                userData.isFormValid = false;
            }
            else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(userData.email.value)) {
                userData.email.error = 'Invalid email address. E.g. example@email.com';
                userData.isFormValid = false;
            }

            if (!userData.password.value) {
                userData.password.error = 'Password is required.';
                userData.isFormValid = false;
            }
            if (!userData.cpassword.value) {
                userData.cpassword.error = 'Confirm Password is required.';
                userData.isFormValid = false;
            }
            if ((userData.cpassword.value && userData.password.value) && (userData.cpassword.value !== userData.password.value)) {
                userData.cpassword.error = 'Password does not match.';
                userData.isFormValid = false;
            }
            return userData
        };

        const isFormFieldValid = (fieldName) => !!(userData[fieldName].touched && userData[fieldName].error);

        const getFormErrorMessage = (fieldName) => {
            return isFormFieldValid(fieldName) && <small className="p-error">{userData[fieldName].error}</small>;
        };
        const updateField = (fieldName, e) => {
            const updatedData = validate({
                ...userData, [fieldName]: {
                    value: e.target.value,
                    error: "",
                    touched: true
                }
            })
            setUserData({
                ...updatedData
            });


        }

        const onRegister = () => {
            axios.post(apiEndPoint + "users/register", {
                name: userData.name.value,
                email: userData.email.value,
                password: userData.password.value,
            }).then((res) => {
                console.log(res)
                msgs.current.clear()
                msgs.current.show([
                    { sticky: true, severity: 'success', summary: 'Success', detail: res.data.message, closable: true }
                ]);

            }).catch(({ response }) => {
                msgs.current.clear()
                msgs.current.show([
                    { sticky: true, severity: 'error', summary: 'Error', detail: response.data.message, closable: true }
                ]);
            })
        }

        const passwordHeader = <h6>Pick a password</h6>;
        const passwordFooter = (
            <React.Fragment>
                <Divider />
                <p className="mt-2">Suggestions</p>
                <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
                    <li>At least one lowercase</li>
                    <li>At least one uppercase</li>
                    <li>At least one numeric</li>
                    <li>Minimum 8 characters</li>
                </ul>
            </React.Fragment>
        );

        return (
            <>
                <h5 className="text-center">Register</h5>
                <Messages className='mb-5' ref={msgs} />
                <div className="p-fluid">
                    <div className="field">
                        <span className="p-float-label">
                            <InputText id="name" autoFocus value={userData.name.value} className={classNames({ 'p-invalid': isFormFieldValid("name") })} onChange={(e) => updateField("name", e)} />
                            <label htmlFor="name" className={classNames({ 'p-error': isFormFieldValid("name") })}>Name*</label>
                        </span>
                        {getFormErrorMessage("name")}
                    </div>

                    <div className="field">
                        <span className="p-float-label p-input-icon-right">
                            <i className="pi pi-envelope" />
                            <InputText id="email" value={userData.email.value} className={classNames({ 'p-invalid': isFormFieldValid("email") })} onChange={(e) => updateField("email", e)} />
                            <label htmlFor="email" className={classNames({ 'p-error': isFormFieldValid("email") })}>Email*</label>
                        </span>
                        {getFormErrorMessage("email")}
                    </div>

                    <div className="field">
                        <span className="p-float-label">
                            <Password id="password" toggleMask value={userData.password.value} className={classNames({ 'p-invalid': isFormFieldValid("password") })} header={passwordHeader} footer={passwordFooter} onChange={(e) => updateField("password", e)} />
                            <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid("password") })}>Password*</label>
                        </span>
                        {getFormErrorMessage("password")}
                    </div>

                    <div className="field">
                        <span className="p-float-label">
                            <Password id="conf-password" value={userData.cpassword.value} toggleMask className={classNames({ 'p-invalid': isFormFieldValid("cpassword") })} header={passwordHeader} footer={passwordFooter} onChange={(e) => updateField("cpassword", e)} />
                            <label htmlFor="conf-password" className={classNames({ 'p-error': isFormFieldValid("cpassword") })}>Confirm Password*</label>
                        </span>
                        {getFormErrorMessage("cpassword")}
                    </div>
                    <Button type="submit" label="Submit" onClick={() => onRegister()} className="mt-2" />

                    <Button label="Back to Login" className='mt-5' onClick={() => setShowRegister(false)} severity="secondary" />
                </div>
            </>
        )
    }

    const LoginScreen = () => {
        const [username, setUsername] = useState("");
        const [password, setPassword] = useState("");
        const dispatch = useDispatch();
        const msgs = useRef(null);
        const navigate = useNavigate();
        const onLogin = () => {

            axios.post(apiEndPoint + "users/login", {
                email: username,
                password: password,
            }).then((response) => {
                const message = (response && response.data && response.data.message) || "Login Successfull."
                const accessToken = (response && response.data && response.data.accessToken) || "";
                msgs.current.clear()
                msgs.current.show([
                    { sticky: true, severity: 'success', summary: 'Success', detail: message, closable: true }
                ]);
                dispatch({
                    type: "UPDATE_TOKEN",
                    payload: accessToken
                });
                navigate('/home');

            }).catch(({ response }) => {
                const message = (response && response.data && response.data.message) || "Something went wrong."
                msgs.current.clear()
                msgs.current.show([
                    { sticky: true, severity: 'error', summary: 'Error', detail: message, closable: true }
                ]);
            })

        }
        return (
            <>
                <h5 className="text-center">Login</h5>
                <Messages className='mb-5' ref={msgs} />
                <div className="p-fluid">
                    <div className="field">
                        <span className="p-float-label p-input-icon-right">
                            <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            <label htmlFor="username" >Username*</label>
                        </span>
                    </div>

                    <div className="field">
                        <span className="p-float-label">
                            <Password id="password" toggleMask value={password} feedback={false} onChange={(e) => setPassword(e.target.value)} />
                            <label htmlFor="password">Password*</label>
                        </span>
                    </div>
                    <Button type="submit" label="Login" onClick={() => onLogin()} className="mt-2" />
                    <Divider type="dashed" className='mt-5 mb-5' align="center">
                        <span>OR</span>
                    </Divider>
                    <Button type="submit" severity='info' label="Sign up" onClick={() => setShowRegister(true)} className="mt-2" />
                </div>
            </>
        )
    }

    return (
        <>

            <div className="form-demo">
                <div className="flex justify-content-center">
                    <div className="card">
                        {!showRegister ? <LoginScreen id="login-screen" /> : <Register />}
                    </div>
                </div>
            </div>

        </>
    )
}
export default Login