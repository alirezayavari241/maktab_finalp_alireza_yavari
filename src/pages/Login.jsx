import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('لطفاً نام کاربری و رمز عبور را وارد کنید');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        username,
        password,
      });

      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken); 

      dispatch(loginSuccess(response.data));
      toast.success('ورود موفقیت‌آمیز بود');
      setTimeout(() => {
        navigate('/panel');
      }, 2000);

    } catch (error) {
      toast.error('نام کاربری یا رمز عبور اشتباه است');
    }
  };

  return (
    <div className="h-screen bg-white font-iransans">
      <Toaster richColors />
      <div className="flex items-center justify-center h-screen">
        <form onSubmit={handleSubmit} className="border-2 p-4 rounded-2xl space-y-8">
          <p className="text-textcolot">نام کاربری و رمز عبور خود را وارد کنید</p>
          <input 
            type="text" 
            placeholder="نام کاربری" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            className="border-2 rounded-lg px-2 py-1 w-full"
            required
          />
          <div className="relative w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="رمز عبور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 rounded-lg px-2 py-1 w-full"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              )}
            </button>
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded-lg">
            ورود
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
