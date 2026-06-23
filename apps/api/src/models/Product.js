import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    subcategory: {
  type: String,
},

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },
    keyBenefits: [
  {
    type: String,
  },
],
uses: [
  {
    image: String,
    title: String,
    description: String,
  },
],

nutritionalInformation: {
  type: String,
},

ingredients: {
  type: String,
},

labReports: [
  {
    type: String,
  },
],

    images: [
      {
        type: String,
      },
    ],

    sku: {
      type: String,
      unique: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
 
);

export default mongoose.model("Product", productSchema);