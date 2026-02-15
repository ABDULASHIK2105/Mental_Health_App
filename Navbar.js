import  { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
    document.body.classList.toggle('dark', savedMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.body.classList.toggle('dark', newMode);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user.name) return null;

  return (
    <nav className="bg-primary text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold">Mental Health App</Link>
        <div className="flex items-center space-x-4">
          <span>Welcome, {user.name}</span>
          <button onClick={toggleDarkMode} className="bg-gray-500 px-3 py-1 rounded">
            {darkMode ? 'Light' : 'Dark'} Mode
          </button>
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;