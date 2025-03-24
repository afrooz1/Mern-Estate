import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // Handle file upload locally (convert to Base64)
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // Convert file to Base64
    reader.onloadend = () => {
      setFormData({ ...formData, avatar: reader.result }); // Store Base64 string in formData
    };
    reader.onerror = () => {
      setFileUploadError(true); // Handle file read errors
    };
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send formData (including Base64 image) to the backend
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    console.log('Show Listings button clicked'); // Add this line
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg mt-20 mb-20">
      <h1 className="text-3xl font-bold text-center my-6 text-teal-400">
        Profile
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Profile Picture Upload */}
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 border-2 border-teal-400"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-500">
              Error uploading image (image must be less than 2 MB)
            </span>
          ) : (
            ''
          )}
        </p>

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          defaultValue={currentUser.username}
          id="username"
          className="p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-white"
          onChange={handleChange}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          id="email"
          defaultValue={currentUser.email}
          className="p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-white"
          onChange={handleChange}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-white"
          onChange={handleChange}
        />

        {/* Update Button */}
        <button
          disabled={loading}
          className="bg-teal-400 text-gray-900 p-3 rounded-lg uppercase font-semibold hover:bg-teal-300 transition duration-300 disabled:opacity-80"
        >
          {loading ? 'Loading...' : 'Update'}
        </button>

        {/* Create Listing Button */}
        <Link
          className="bg-green-500 text-white p-3 rounded-lg uppercase text-center font-semibold hover:bg-green-400 transition duration-300"
          to={'/create-listing'}
        >
          Create Listing
        </Link>
      </form>

      {/* Delete Account and Sign Out */}
      <div className="flex justify-between mt-6">
        <span
          onClick={handleDeleteUser}
          className="text-red-500 cursor-pointer hover:text-red-400 transition duration-300"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-500 cursor-pointer hover:text-red-400 transition duration-300"
        >
          Sign Out
        </span>
      </div>

      {/* Error and Success Messages */}
      {error && <p className="text-red-500 mt-5 text-center">{error}</p>}
      {updateSuccess && (
        <p className="text-green-500 mt-5 text-center">
          User updated successfully!
        </p>
      )}

      {/* Show Listings Button */}
      <button
  onClick={handleShowListings} // Ensure this is correct
  className="w-full bg-teal-400 text-gray-900 p-3 rounded-lg uppercase font-semibold hover:bg-teal-300 transition duration-300 mt-6"
>
  Show Listings
</button>
      {showListingsError && (
        <p className="text-red-500 mt-5 text-center">
          Error showing listings
        </p>
      )}

      {/* User Listings */}
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4 mt-6">
          <h1 className="text-2xl font-bold text-center text-teal-400">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4 bg-gray-700"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain rounded-lg"
                />
              </Link>
              <Link
                className="text-white font-semibold hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-500 uppercase hover:text-red-400 transition duration-300"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-500 uppercase hover:text-green-400 transition duration-300">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}