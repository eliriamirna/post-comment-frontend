import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserForm } from './pages/UserForm';
import { Posts } from './pages/Posts';
import { PostForm } from './pages/PostForm';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/create-user" element={<UserForm />} />
          <Route path="/create-user/:id" element={<UserForm />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/create-post" element={<PostForm />} />
          <Route path="/create-post/:id" element={<PostForm />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
