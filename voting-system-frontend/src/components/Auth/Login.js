import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import image from '../../assets/image.png'; // Import the image

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(null);
  const [jwtToken, setJwtToken] = useState('');
  const { setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userId) {
      // First step: Authenticate with username and password
      try {
        const response = await api.post('/auth/login', { username, password });
        const { user, token } = response.data;
        setUserId(user._id);
        setJwtToken(token);
        toast.success('Login successful! Please enter your 2FA token.');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error('Incorrect username or password!');
        } else {
          toast.error('Login error');
        }
      }
    } else {
      // Second step: Verify 2FA token
      try {
        const tokenResponse = await api.post('/auth/verify-2fa', { userId, token });
        if (tokenResponse.status === 200) {
          setAuthData({ token: jwtToken, user: { _id: userId, username } });
          toast.success('2FA verification successful!');
          navigate('/elections');
        } else {
          toast.error('Invalid 2FA token!');
        }
      } catch (error) {
        toast.error('2FA verification error');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="flex justify-center mb-4">
          <img src={image} alt="Login" style={{ width: '150px', height: 'auto' }} /> {/* Center the image */}
        </div>
        {!userId && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </>
        )}
        {userId && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="token">
              2FA Token
            </label>
            <input
              type="text"
              id="token"
              placeholder="2FA Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {userId ? 'Verify 2FA' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
