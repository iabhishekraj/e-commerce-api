const express = require("express");
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);

app.listen(PORT, () => {
  console.log(`App started on port: ${PORT}`);
});
