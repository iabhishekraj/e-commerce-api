const prisma = require("../config/prisma");

const createProduct = async (productData) => {
  return await prisma.product.create({ data: productData });
};

const getAllProducts = async () => {
  return await prisma.product.findMany({
    include: { category: true, reviews: true },
  });
};

const getProductById = async (productId) => {
  return await prisma.product.findUnique({
    where: { product_id: productId },
    include: { category: true, reviews: true },
  });
};

const updateProduct = async (id, productData) => {
  return await prisma.product.update({
    where: { product_id: id },
    data: productData,
  });
};

const deleteProduct = async (id) => {
  return await prisma.product.delete({
    where: {
      product_id: id,
    },
  });
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
