const express = require("express");
const ProductController = require("../controllers/productController");
const UploadMiddleWare = require("../middlewares/uploadMiddleware");
const router = express();

router.post(
  "/addProduct",
  UploadMiddleWare.upload.array("images", 5),
  ProductController.addProduct
);

router.get("/", ProductController.getProducts);
router.get("/", ProductController.getProduct);
router.put("/", ProductController.updateProduct);
router.delete("/", ProductController.deleteProduct);

module.exports = router;
