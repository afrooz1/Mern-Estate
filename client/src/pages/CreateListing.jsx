import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = async () => {
    if (files.length === 0) {
      return setImageUploadError('Please select images to upload.');
    }
    if (files.length + formData.imageUrls.length > 6) {
      return setImageUploadError('You can only upload up to 6 images.');
    }

    setUploading(true);
    setImageUploadError(false);

    try {
      const base64Urls = await Promise.all(
        Array.from(files).map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
              resolve(reader.result); // Resolve with Base64 string
            };
            reader.onerror = () => {
              reject(new Error('Failed to read image file.'));
            };
          });
        })
      );

      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...base64Urls],
      }));
    } catch (error) {
      console.error('Upload Error:', error);
      setImageUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');

      setLoading(true);
      setError(false);

      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
      } else {
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-6xl mx-auto bg-gray-900 text-white">
      <h1 className="text-4xl font-bold text-center my-8 text-teal-400">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-6 flex-1">
          {/* Name */}
          <input
            type="text"
            placeholder="Name"
            className="p-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            className="p-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />

          {/* Address */}
          <input
            type="text"
            placeholder="Address"
            className="p-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

          {/* Checkboxes */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5 accent-teal-400"
                onChange={handleChange}
                checked={formData.type === 'sale'}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5 accent-teal-400"
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5 accent-teal-400"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5 accent-teal-400"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5 accent-teal-400"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          {/* Numbers */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="p-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                {formData.type === 'rent' && (
                  <span className="text-xs">($ / month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  {formData.type === 'rent' && (
                    <span className="text-xs">($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col flex-1 gap-6">
          {/* Images */}
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-400 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 bg-gray-800 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 bg-teal-400 text-gray-900 rounded-lg uppercase font-semibold hover:bg-teal-300 transition duration-300 disabled:opacity-80"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className="text-red-500 text-sm">
            {imageUploadError && imageUploadError}
          </p>

          {/* Uploaded Images */}
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 bg-gray-800 rounded-lg items-center"
              >
                <img
                  src={url} // Use the Base64 URL directly
                  alt="listing image"
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-2 text-red-500 hover:text-red-400 transition duration-300"
                >
                  Delete
                </button>
              </div>
            ))}

          {/* Submit Button */}
          <button
            disabled={loading || uploading}
            className="p-3 bg-teal-400 text-gray-900 rounded-lg uppercase font-semibold hover:bg-teal-300 transition duration-300 disabled:opacity-80"
          >
            {loading ? 'Creating...' : 'Create listing'}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}