import { useState } from 'react';
import { FaEnvelope, FaLock } from "react-icons/fa";
import './LoginForm.css';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleBlur = (field) => {
        if (field === 'email') {
            if (email.trim() === '') {
                setEmailError('Please enter email.');
            } else if (!isValidEmail(email)) {
                setEmailError('Please enter a valid email address.');
            } else {
                setEmailError('');
            }
        } else if (field === 'password') {
            if (password.trim() === '') {
                setPasswordError('Please enter password.');
            } else {
                setPasswordError('');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let valid = true;
        if (email.trim() === '') {
            setEmailError('Please enter email.');
            valid = false;
        } else if (!isValidEmail(email)) {
            setEmailError('Please enter a valid email address.');
            valid = false;
        } else {
            setEmailError('');
        }

        if (password.trim() === '') {
            setPasswordError('Please enter password.');
            valid = false;
        } else {
            setPasswordError('');
        }

        // Submit logic here if validation passes
        if (valid) {
            // Do submit
        }
    };

    const isValidEmail = (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <div className="input-box">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={() => handleBlur('email')}
                        className={emailError ? 'error' : ''}
                        required
                    />
                    <FaEnvelope className='icon' />
                </div>
                {emailError && <div className="error-msg">{emailError}</div>}
                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        onBlur={() => handleBlur('password')}
                        className={passwordError ? 'error' : ''}
                        required
                    />
                    <FaLock className='icon' />
                </div>
                {passwordError && <div className="error-msg">{passwordError}</div>}
                <div className="remember-forgot">
                    <label><input type="checkbox" />Remember me</label>
                    <a href="#">Forgot password?</a>
                </div>
                <button type='submit'>Login</button>
            </form>
        </div>
    );
}

export default LoginForm;
