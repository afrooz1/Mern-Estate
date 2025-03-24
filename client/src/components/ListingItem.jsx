import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ listing }) {
  return (
    <div className="bg-gray-800 shadow-lg hover:shadow-xl transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        {/* Listing Image */}
        <img
          src={
            listing.imageUrls[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />

        {/* Listing Details */}
        <div className="p-4 flex flex-col gap-2">
          {/* Listing Name */}
          <p className="text-xl font-semibold text-white truncate">
            {listing.name}
          </p>

          {/* Address */}
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-5 w-5 text-teal-400" />
            <p className="text-sm text-gray-300 truncate">{listing.address}</p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-400 line-clamp-2">
            {listing.description}
          </p>

          {/* Price */}
          <p className="text-teal-400 mt-2 font-semibold">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </p>

          {/* Bedrooms and Bathrooms */}
          <div className="text-gray-300 flex gap-4">
            <div className="font-bold text-xs">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds `
                : `${listing.bedrooms} bed `}
            </div>
            <div className="font-bold text-xs">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths `
                : `${listing.bathrooms} bath `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}