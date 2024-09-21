import React, { useState } from "react";
import axios from 'axios';
import {toast} from 'react-hot-toast'
import { Link, useNavigate } from "react-router-dom"
import {FiMail} from "react-icons/fi"
import {RiLockPasswordLine} from "react-icons/ri"
import styles from './Login.module.css';
import Logo from '../../assets/logo.png';

export default function Login() {
  const [data, setData] = useState({
      email: "",
      password: "",
    });
    

    const loginUser = async (e) => {
      e.preventDefault();
      const { email, password } = data;
      try {
        const response = await axios.post('/login', { email, password });
        const { data } = response;
        
        if (data.error) {
          toast.error(data.error);
        } else {
          setData({});
          if (data.role === 'superadmin') {
            window.location.href = '/super/dashboard';
          } else if (data.role === 'admin') {
            window.location.href = '/dashboard';
          } else {
            toast.error('User role is not recognized.');
          }
        }
      } catch (error) {
        console.error('Login failed:', error);
        toast.error('An error occurred during login. Please try again.');
      }
    };

      return (
        <div className={styles.container}>
            <div className={styles['container-form']}>
                <div className={styles['logo-container']}>
                    <img src={Logo} alt="Logo" className={styles.logo} />
                </div>
                <form onSubmit={loginUser}>
                    <h1>Welcome!</h1>
                    <p>Please sign in to continue.</p>
                    <div className={styles.inputBox}>
                        <FiMail className={styles.mail} />
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            placeholder="Enter Email"
                            required
                        />
                    </div>
                    <div className={styles.inputBox}>
                        <RiLockPasswordLine className={styles.password} />
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            required
                        />
                    </div>
                    <div className={styles.divBtn}>
                        <button className={styles.loginBtn} type="submit">LOGIN</button>
                    </div>
                </form>
                <div className={styles.dont}>
                    <p>tatanggalin wala na register forgotpass nalng <Link to="/"><span>Sign up</span></Link></p>
                </div>
            </div>
        </div>
    );
}