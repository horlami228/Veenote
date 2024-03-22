"use client"; // Mark as Client Component

import { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [userName, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/v1/user/create', {
        userName,
        email,
        password,
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Register for Veenote</h3>
        <form onSubmit={handleSubmit}>
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
            <a href="/login" className="text-sm text-blue-600 hover:underline">Already have an account?</a>
          </div>
        </form>
      </div>
    </div>
  );
}
