import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-gray-700 shadow-lg">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
        {/* Logo */}
        <Link to="/">
          <h1 className="font-bold text-xl sm:text-2xl flex flex-wrap">
            <span className="text-teal-400">Urban</span>
            <span className="text-white">Nest</span>
          </h1>
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-700 p-2 rounded-lg flex items-center w-48 sm:w-64"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none text-white placeholder-gray-400 flex-grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="text-teal-400 hover:text-teal-300">
            <FaSearch className="w-5 h-5" />
          </button>
        </form>

        {/* Navigation Links */}
        <ul className="flex gap-4 items-center">
          <Link to="/">
            <li className="hidden sm:inline text-white hover:text-teal-400 transition duration-300">
              Home
            </li>
          </Link>
          
          <Link to="/about">
            <li className="hidden sm:inline text-white hover:text-teal-400 transition duration-300">
              About
            </li>
          </Link>
          {/* <Link to="/contact">
            <li className="hidden sm:inline text-white hover:text-teal-400 transition duration-300">
              Contact us
            </li>
          </Link> */}

          <Link to="/profile">
          
            {currentUser ? (
              <img
                className="rounded-full h-8 w-8 object-cover border-2 border-teal-400"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="text-white hover:text-teal-400 transition duration-300">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}