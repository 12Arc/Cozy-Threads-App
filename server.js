import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//config
dotenv.config();

//database
connectDB();

app.use(cors());

//middleware
app.use(express.json());
app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, 'client/dist')));

// Catch-all route to serve the index.html from the 'dist' directory
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

//routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);

app.get("/", (req, res) => {
    res.send("<h1>Welcome to Ecommerce app</h1>");
  });
  const PORT = process.env.PORT || 3000;

  
  app.listen(PORT, () => {
    console.log(
      `Server Running on ${PORT}`
    )
  });  