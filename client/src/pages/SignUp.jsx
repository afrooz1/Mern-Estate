import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-teal-400 mb-6 text-center">
          Sign Up
        </h1>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Username Input */}
          <div>
            <label htmlFor="username" className="block text-gray-400 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              onChange={handleChange}
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              onChange={handleChange}
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              onChange={handleChange}
            />
          </div>

          {/* Sign Up Button */}
          <button
            disabled={loading}
            className="w-full bg-teal-400 text-gray-900 p-3 rounded-lg uppercase font-semibold hover:bg-teal-300 transition duration-300 disabled:opacity-80"
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>

          {/* OAuth Component */}
          <OAuth />
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">Have an account?</p>
          <Link
            to="/sign-in"
            className="text-teal-400 hover:text-teal-300 transition duration-300"
          >
            Sign In
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 mt-5 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}