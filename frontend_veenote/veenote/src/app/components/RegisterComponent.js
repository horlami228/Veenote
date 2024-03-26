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
        setErrorMessage("Invalid. Please try again.");
      }
      else {
        setErrorMessage('An error occurred. Please try again later.');
      }
    }
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
          <div className="mt-4">
            <label className="block" htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full px-4 py-2 mt-2 border rounded-md text-gray-700"
              required
            />
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
