import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import LoginHeader from './loginheader';
import LoginButton from './loginbutton';
import ShowPasswordToggle from './showPasswordToggle';

const LoginForm = () => {
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
    <div>
      <div className=' w-full'><img src='src/assets/icons/logo.png' height={100} width={100} className='mx-auto border-2 border-btnbg rounded-md -mb-1'/></div>
          <form onSubmit={handleSubmit} className="border-4  p-4 rounded-2xl space-y-8 border-btnbg">
      <LoginHeader />
      <div className='relative w-full flex'>
      <div className='absolute  ml-48 mt-2'>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
</svg>

      </div>
      <input 
        type="text" 
        placeholder="نام کاربری       "  
        value={username} 
        onChange={(e) => setUsername(e.target.value)}
        className="border-2 rounded-lg px-2 py-1 w-full placeholder:text-right"
        
      />
      </div>
      <div className="relative w-full">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="رمز عبور        " 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-2 rounded-lg px-2 py-1 w-full placeholder:text-right"
          
        />
        <ShowPasswordToggle showPassword={showPassword} setShowPassword={setShowPassword} />
      </div>
      <LoginButton />
    </form>
    <div className='w-full'><button onClick={()=>navigate('/')} className='border-btnbg rounded-xl p-2 border-4 mx-auto flex border-t-0 -mt-1'>صفحه اصلی</button></div>
    </div>
  );
};

export default LoginForm;
