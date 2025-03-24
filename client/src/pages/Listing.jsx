import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        console.log('Fetching listing with ID:', params.listingId); // Log the listing ID
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        console.log('Response:', res); // Log the response
        const data = await res.json();
        console.log('Data:', data); // Log the parsed data
        if (data.success === false) {
          console.error('Backend Error:', data.message); // Log backend error
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        console.error('Fetch Error:', error); // Log any errors
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  return (
    <main className="bg-gray-900 text-white min-h-screen">
      {loading && (
        <p className="text-center my-7 text-2xl text-teal-400">Loading...</p>
      )}
      {error && (
        <p className="text-center my-7 text-2xl text-red-500">
          Something went wrong!
        </p>
      )}
      {listing && !loading && !error && (
        <div>
          {/* Swiper */}
          <Swiper navigation className="my-6">
            {listing.imageUrls.map((url) => {
              console.log('Image URL:', url); // Log each image URL
              return (
                <SwiperSlide key={url}>
                  <div
                    className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: 'cover',
                    }}
                  ></div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Share Button */}
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-gray-800 cursor-pointer hover:bg-gray-700 transition duration-300">
            <FaShare
              className="text-teal-400"
              onClick={() => {
                console.log('Share button clicked'); // Log button click
                if (!navigator.clipboard) {
                  console.error('Clipboard API not supported');
                  return;
                }
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-gray-800 p-2 text-teal-400">
              Link copied!
            </p>
          )}

          {/* Listing Details */}
          <div className="max-w-4xl mx-auto p-4 my-8 flex flex-col gap-6">
            {/* Title and Price */}
            <p className="text-2xl sm:text-3xl font-bold text-teal-400">
              {listing.name} - ${' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>

            {/* Address */}
            <p className="flex items-center gap-2 text-gray-400 text-sm">
              <FaMapMarkerAlt className="text-teal-400" />
              {listing.address}
            </p>

            {/* Type and Offer */}
            <div className="flex flex-wrap gap-4">
              <p className="bg-teal-400 text-gray-900 w-full max-w-[200px] text-center p-2 rounded-md font-semibold">
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className="bg-red-500 text-white w-full max-w-[200px] text-center p-2 rounded-md font-semibold">
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-300">
              <span className="font-semibold text-teal-400">Description - </span>
              {listing.description}
            </p>

            {/* Features */}
            <ul className="text-teal-400 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaChair className="text-lg" />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>

            {/* Contact Button */}
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => {
                  console.log('Contact button clicked'); // Log button click
                  console.log('Current User ID:', currentUser?._id); // Log current user ID
                  console.log('Listing UserRef:', listing.userRef); // Log listing userRef
                  setContact(true);
                }}
                className="bg-teal-400 text-gray-900 rounded-lg uppercase font-semibold hover:bg-teal-300 transition duration-300 p-3"
              >
                Contact Landlord
              </button>
            )}

            {/* Contact Form */}
            {contact && (
              <>
                <Contact listing={listing} />
                {console.log('Contact Form Rendered')} {/* Log when the contact form is rendered */}
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}