import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    parking: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
      index: true, // Add index for type filtering
    },
    offer: {
      type: Boolean,
      required: true,
    },
  imageUrls: {
  type: [String],
  required: true
},
    userRef: {
      type: String,
      required: true,
      index: true, // Add index for user lookups
    },
  },
  { timestamps: true }
);

// Compound indexes for common query patterns
listingSchema.index({ type: 1, createdAt: -1 }); // For type + latest
listingSchema.index({ userRef: 1, createdAt: -1 }); // For user listings
listingSchema.index({ offer: 1, createdAt: -1 }); // For offers
listingSchema.index({ regularPrice: 1 }); // For price sorting

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;