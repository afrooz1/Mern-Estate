import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

// Create Listing
export const createListing = async (req, res, next) => {
  try {
    const {
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrls, // Array of Base64 image strings
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !description ||
      !address ||
      !regularPrice ||
      !bathrooms ||
      !bedrooms ||
      !type ||
      !imageUrls ||
      imageUrls.length === 0
    ) {
      return next(errorHandler(400, 'All fields are required!'));
    }

    // Create the listing
    const listing = await Listing.create({
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrls, // Store Base64 image strings directly
      userRef: req.user.id, // Associate the listing with the logged-in user
    });

    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

// Delete Listing
export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

// Update Listing
export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const {
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrls, // Array of Base64 image strings
    } = req.body;

    // Update the listing
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name,
          description,
          address,
          regularPrice,
          discountPrice,
          bathrooms,
          bedrooms,
          furnished,
          parking,
          type,
          offer,
          imageUrls, // Update Base64 image strings
        },
      },
      { new: true } // Return the updated listing
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

// Get Listing by ID
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

// Get All Listings
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9; // Default limit is 9
    const type = req.query.type || 'all'; // Default type is 'all'

    let query = {};
    if (type !== 'all') {
      query.type = type; // Filter by type if provided
    }

    const listings = await Listing.find(query).limit(limit);
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};