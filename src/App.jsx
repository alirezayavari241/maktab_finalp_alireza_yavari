import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import { Provider } from 'react-redux';
import store from './redux/store';
import Panel from './pages/Management';
function App() {
  return (
    <Provider store={store}>

    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path='/panel' element={<Panel/>} />
      </Routes>
    </Router>
    </Provider>
  );
}

export default App;