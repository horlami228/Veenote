"use client"; // Mark as Client Component

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { notification } from 'antd';

export default function Register() {
  const [userName, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    try {
      const response = await axios.post('http://localhost:8000/api/v1/user/create', {
        userName,
        email,
        password,
      });
      console.log(response);
      setUsername('');
      setEmail('');
      setPassword('');
      notification.success({
        message: 'Success',
        description: 'User registered successfully',
      });

    router.push('/login');
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        if (error.response.data.errorCode === 'UserExists') {
        setErrorMessage("User already exists.");
        }
        setErrorMessage('Please fill in all the fields.')
      }
      else {
        setErrorMessage('An error occurred. Please try again later.');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-600">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center mb-4">Register for Veenote</h3>
        <form onSubmit={handleSubmit}>
          {/* if error message*/}
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
          <div>
            <label className="block" htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="Username"
              id="username"
              onChange={(e) => setUsername(e.target.value)}
              value={userName}
              className="w-full px-4 py-2 mt-2 border rounded-md text-gray-700"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block" htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full px-4 py-2 mt-2 border rounded-md text-gray-700"
              required
            />
          </div>
       <div className="mt-4 flex items-center">
            <div className="flex-grow">
              <label className="block" htmlFor="password">Password</label>
              <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Password"
                name="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full px-4 py-2 mt-2 border rounded-md text-gray-700"
                required
              />
            </div>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="ml-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md mt-8"
            >
            {isPasswordVisible ? (
              // Crossed Eye SVG Icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" /> {/* This line adds a "cross" effect */}
              </svg>
              ) : (
              // Eye SVG Icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825L10.05 15m-6.9-3C4.732 7.943 8.523 5 13 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-1.386 0-2.72-.305-3.95-.842M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              )}

            </button>
          </div>
          <div className="flex items-baseline justify-between">
            <button type="submit" className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Register</button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p> Already have an account? <Link href="/login" className="text-blue-600 hover:text-blue-800"> Login </Link></p>
        </div>
      </div>
    </div>
  );
}
