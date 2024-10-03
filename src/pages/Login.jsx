

import React from 'react';
import { useEffect } from 'react';
import LoginForm from '../components/login/loginform';
import { Toaster } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      navigate('/panel');
    }
  }, [navigate]);


  return (
    <div className="h-screen bg-pbg font-iransans">
      <Toaster richColors />
      <div className="flex items-center justify-center h-screen">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;

