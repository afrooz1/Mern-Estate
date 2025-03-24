import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-teal-400 mb-6 text-center">
          Sign In
        </h1>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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

          {/* Sign In Button */}
          <button
            disabled={loading}
            className="w-full bg-teal-400 text-gray-900 p-3 rounded-lg uppercase font-semibold hover:bg-teal-300 transition duration-300 disabled:opacity-80"
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>

          {/* OAuth Component */}
          <OAuth />
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">Don't have an account?</p>
          <Link
            to="/sign-up"
            className="text-teal-400 hover:text-teal-300 transition duration-300"
          >
            Sign Up
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