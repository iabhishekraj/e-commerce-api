const express = require("express");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const productRoutes = require("./routes/productRoutes");
require("dotenv").config();

const app = express();
console.log("process.env.PORT", process.env);
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/product", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);

app.listen(PORT, () => {
  console.log(`App started on port: ${PORT}`);
});
