const Joi = require("joi");
const UploadFilesToS3 = require("../utils/s3Uploader");

const addProduct = async (req, res) => {
  const productSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500).required(),
    category_id: Joi.number().integer().positive().required(),
    brand: Joi.string().min(2).max(50).required(),
    images: Joi.array().items(Joi.string().uri()), // Image URLs validation
  });

  try {
    // Validate request body (without images first)
    const { error, value } = productSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((e) => e.message) });
    }

    // Ensure files exist before processing
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image is required." });
    }

    // Upload images to S3 and get URLs
    const imageUrls = await UploadFilesToS3.uploadFilesToS3(req.files);

    // Attach image URLs to product data
    const productData = { ...value, images: imageUrls };

    // Save product to database
    const product = await ProductHandler.createProduct(productData);

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error("Error adding product:", error);
    res
      .status(500)
      .json({ error: "Error adding product", details: error.message });
  }
};
const getProduct = (req, res) => {};
const getProducts = (req, res) => {};
const updateProduct = (req, res) => {};
const deleteProduct = (req, res) => {};

module.exports = {
  addProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
