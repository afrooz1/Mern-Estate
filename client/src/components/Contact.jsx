import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-4 p-6 bg-gray-800 rounded-lg shadow-lg">
          {/* Contact Information */}
          <p className="text-gray-300">
            Contact{' '}
            <span className="font-semibold text-teal-400">{landlord.username}</span>{' '}
            for{' '}
            <span className="font-semibold text-teal-400">
              {listing.name.toLowerCase()}
            </span>
          </p>

          {/* Message Textarea */}
          <textarea
            name="message"
            id="message"
            rows="3"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400"
          ></textarea>

          {/* Send Message Button */}
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-teal-400 text-gray-900 text-center p-3 uppercase rounded-lg font-semibold hover:bg-teal-300 transition duration-300"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}