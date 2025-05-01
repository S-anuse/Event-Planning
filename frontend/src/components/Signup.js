import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post('http://localhost:8000/api/users/', {
        username,
        password,
      });
      navigate('/login');
    } catch (error) {
      alert('Signup failed');
    }
  };

  return (
    <div className="container mt-5">
      <h2>EventSync - Sign Up</h2>
      <input
        type="text"
        className="form-control mb-3"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        className="form-control mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button className="btn btn-primary" onClick={handleSignup}>
        Sign Up
      </button>
      <p className="mt-3">
        Have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default Signup;