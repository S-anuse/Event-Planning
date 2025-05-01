import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.access);
      navigate('/events');
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div className="container mt-5">
      <h2>EventSync - Login</h2>
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
      <button className="btn btn-primary" onClick={handleLogin}>
        Login
      </button>
      <p className="mt-3">
        No account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}

export default Login;