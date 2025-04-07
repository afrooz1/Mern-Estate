import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';
import mongoose from 'mongoose';

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private
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
      imageUrls,
    } = req.body;

    // Validate required fields
    const requiredFields = [
      'name', 'description', 'address', 'regularPrice', 
      'bathrooms', 'bedrooms', 'type', 'imageUrls'
    ];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return next(errorHandler(400, `Missing required fields: ${missingFields.join(', ')}`));
    }

    // Validate prices
    if (isNaN(regularPrice)) {
      return next(errorHandler(400, 'Regular price must be a number'));
    }

    if (regularPrice <= 0) {
      return next(errorHandler(400, 'Regular price must be greater than 0'));
    }

    if (discountPrice && discountPrice >= regularPrice) {
      return next(errorHandler(400, 'Discount price must be less than regular price'));
    }

    // Validate image URLs
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return next(errorHandler(400, 'At least one image is required'));
    }

    if (imageUrls.length > 10) {
      return next(errorHandler(400, 'Maximum 10 images allowed'));
    }

    // Create new listing
    const listing = await Listing.create({
      name: name.trim(),
      description: description.trim(),
      address: address.trim(),
      regularPrice: parseFloat(regularPrice),
      discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
      bathrooms: parseInt(bathrooms),
      bedrooms: parseInt(bedrooms),
      furnished: Boolean(furnished),
      parking: Boolean(parking),
      type,
      offer: Boolean(offer),
      imageUrls,
      userRef: req.user.id,
    });

    res.status(201).json(listing);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map(err => err.message);
      return next(errorHandler(400, messages.join(', ')));
    }
    next(error);
  }
}


// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private
export const deleteListing = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(errorHandler(400, 'Invalid listing ID'));
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found'));
    }

    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(403, 'Unauthorized to delete this listing'));
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a listing
// @route   PUT /api/listings/:id
// @access  Private
export const updateListing = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(errorHandler(400, 'Invalid listing ID'));
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found'));
    }

    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(403, 'Unauthorized to update this listing'));
    }

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
      imageUrls,
    } = req.body;

    // Validate prices if provided
    if (regularPrice && (isNaN(regularPrice) || regularPrice <= 0)) {
      return next(errorHandler(400, 'Invalid regular price'));
    }

    if (discountPrice && discountPrice >= regularPrice) {
      return next(errorHandler(400, 'Discount price must be less than regular price'));
    }

    // Validate image URLs if provided
    if (imageUrls && (!Array.isArray(imageUrls) || imageUrls.length === 0)) {
      return next(errorHandler(400, 'At least one image is required'));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: name ? name.trim() : listing.name,
          description: description ? description.trim() : listing.description,
          address: address ? address.trim() : listing.address,
          regularPrice: regularPrice ? parseFloat(regularPrice) : listing.regularPrice,
          discountPrice: discountPrice ? parseFloat(discountPrice) : listing.discountPrice,
          bathrooms: bathrooms ? parseInt(bathrooms) : listing.bathrooms,
          bedrooms: bedrooms ? parseInt(bedrooms) : listing.bedrooms,
          furnished: furnished !== undefined ? Boolean(furnished) : listing.furnished,
          parking: parking !== undefined ? Boolean(parking) : listing.parking,
          type: type || listing.type,
          offer: offer !== undefined ? Boolean(offer) : listing.offer,
          imageUrls: imageUrls || listing.imageUrls,
        },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map(err => err.message);
      return next(errorHandler(400, messages.join(', ')));
    }
    next(error);
  }
};

// @desc    Get a single listing
// @route   GET /api/listings/:id
// @access  Public
export const getListing = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(errorHandler(400, 'Invalid listing ID'));
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found'));
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all listings with search, filter and pagination
// @route   GET /api/listings
// @access  Public
export const getListings = async (req, res, next) => {
  try {
    // Parse query parameters with defaults
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const searchTerm = req.query.searchTerm || '';
    const type = req.query.type || 'all';
    const parking = req.query.parking === 'true';
    const furnished = req.query.furnished === 'true';
    const offer = req.query.offer === 'true';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';

    // Build query object
    const query = {};

    // Search term (case insensitive)
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { address: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    // Type filter
    if (type !== 'all') {
      query.type = type;
    }

    // Boolean filters
    if (parking) query.parking = true;
    if (furnished) query.furnished = true;
    if (offer) query.offer = true;

    // Build sort options
    const sortOptions = {};
    if (sort === 'regularPrice') {
      sortOptions.regularPrice = order === 'desc' ? -1 : 1;
    } else {
      sortOptions[sort] = order === 'desc' ? -1 : 1;
    }

    // Execute query
    const listings = await Listing.find(query)
      .sort(sortOptions)
      .skip(startIndex)
      .limit(limit);

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get listings by user
// @route   GET /api/listings/user/:userId
// @access  Public
export const getUserListings = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return next(errorHandler(400, 'Invalid user ID'));
    }

    const listings = await Listing.find({ userRef: req.params.userId });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};