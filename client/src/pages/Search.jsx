import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    
    const newSidebardata = {
      searchTerm: '',
      type: 'all',
      parking: false,
      furnished: false,
      offer: false,
      sort: 'created_at',
      order: 'desc',
    };

    if (urlParams.has('searchTerm')) newSidebardata.searchTerm = urlParams.get('searchTerm');
    if (urlParams.has('type')) newSidebardata.type = urlParams.get('type');
    if (urlParams.has('parking')) newSidebardata.parking = urlParams.get('parking') === 'true';
    if (urlParams.has('furnished')) newSidebardata.furnished = urlParams.get('furnished') === 'true';
    if (urlParams.has('offer')) newSidebardata.offer = urlParams.get('offer') === 'true';
    if (urlParams.has('sort')) newSidebardata.sort = urlParams.get('sort');
    if (urlParams.has('order')) newSidebardata.order = urlParams.get('order');

    setSidebardata(newSidebardata);

    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      setShowMore(false);
      try {
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        
        if (!res.ok) {
          throw new Error('No listings found matching your criteria');
        }
    
        const data = await res.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data received from server');
        }
        
        if (data.length === 0) {
          throw new Error('No listings found matching your criteria');
        }
        
        setListings(data);
        setShowMore(data.length >= 9);
      } catch (err) {
        console.error('Search error:', err);
        setError(err.message);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (type === 'radio' && (id === 'all' || id === 'rent' || id === 'sale')) {
      setSidebardata(prev => ({
        ...prev,
        type: id,
        ...(id !== 'all' && { offer: false })
      }));
    } 
    else if (type === 'checkbox') {
      setSidebardata(prev => ({
        ...prev,
        [id]: checked
      }));
    } 
    else if (id === 'sort_order') {
      const [sort, order] = value.split('_');
      setSidebardata(prev => ({
        ...prev,
        sort: sort || 'created_at',
        order: order || 'desc'
      }));
    } 
    else {
      setSidebardata(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    
    if (sidebardata.searchTerm) urlParams.set('searchTerm', sidebardata.searchTerm.trim());
    if (sidebardata.type !== 'all') urlParams.set('type', sidebardata.type);
    if (sidebardata.parking) urlParams.set('parking', 'true');
    if (sidebardata.furnished) urlParams.set('furnished', 'true');
    if (sidebardata.offer) urlParams.set('offer', 'true');
    if (sidebardata.sort) urlParams.set('sort', sidebardata.sort);
    if (sidebardata.order) urlParams.set('order', sidebardata.order);
    
    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    try {
      const startIndex = listings.length;
      const urlParams = new URLSearchParams(location.search);
      urlParams.set('startIndex', startIndex);
      
      const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
      const data = await res.json();
      
      if (!res.ok || !Array.isArray(data) || data.length === 0) {
        setShowMore(false);
        return;
      }

      setListings(prev => [...prev, ...data]);
      setShowMore(data.length >= 9);
    } catch (err) {
      console.error('Error loading more listings:', err);
      setError('Failed to load more listings');
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-900 text-white min-h-screen">
      {/* Sidebar */}
      <div className="p-6 border-b-2 md:border-r-2 md:min-h-screen border-gray-700 md:w-80">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Search Term */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* Type */}
          <div className="flex gap-4 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="radio"
                id="all"
                name="type"
                className="w-5 accent-teal-400"
                onChange={handleChange}
                checked={sidebardata.type === 'all'}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="rent"
                name="type"
                className="w-5 accent-teal-400"
                onChange={handleChange}
                checked={sidebardata.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="sale"
                name="type"
                className="w-5 accent-teal-400"
                onChange={handleChange}
                checked={sidebardata.type === 'sale'}
              />
              <span>Sale</span>
            </div>
          </div>

          {/* Offer */}
          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              id="offer"
              className="w-5 accent-teal-400"
              onChange={handleChange}
              checked={sidebardata.offer}
              disabled={sidebardata.type !== 'all'}
            />
            <span className={sidebardata.type !== 'all' ? 'text-gray-500' : ''}>
              Offer
            </span>
          </div>

          {/* Amenities */}
          <div className="flex gap-4 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5 accent-teal-400"
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5 accent-teal-400"
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              value={`${sidebardata.sort}_${sidebardata.order}`}
              id="sort_order"
              className="border rounded-lg p-3 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          {/* Search Button */}
          <button 
            type="submit"
            className="bg-teal-400 text-gray-900 p-3 rounded-lg uppercase font-semibold hover:bg-teal-300 transition duration-300 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Listing Results */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold border-b border-gray-700 p-3 text-teal-400">
          {sidebardata.searchTerm ? `Results for "${sidebardata.searchTerm}"` : 'Listing Results'}
        </h1>
        <div className="p-6 flex flex-wrap gap-6">
          {error && (
            <div className="w-full text-center py-10">
              <p className="text-xl text-red-400">{error}</p>
              {sidebardata.searchTerm && (
                <p className="text-gray-400 mt-2">
                  Try different search terms or filters
                </p>
              )}
            </div>
          )}

          {!loading && !error && listings.length === 0 && (
            <div className="w-full text-center py-10">
              <p className="text-xl text-gray-400">No listings found</p>
              <p className="text-gray-500 mt-2">Adjust your search filters or try different keywords</p>
            </div>
          )}

          {loading && listings.length === 0 && (
            <p className="text-xl text-gray-400 text-center w-full py-10">Searching listings...</p>
          )}

          {!loading && !error && listings.length > 0 && (
            <>
              {listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </>
          )}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              disabled={loading}
              className="text-teal-400 hover:underline p-6 text-center w-full disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Show more'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}