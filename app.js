import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import 'express-async-errors'

// db
import connectDB from "./db/connect.js";

// middleware
import notFoundMiddleware from "./middlewares/not-found.js";
import errorHandlerMiddleware from './middlewares/error-handler.js'

// routes
import authRoutes from './routes/authRoutes.js'

dotenv.config();

const app = express();
// to parse JSON requests sent from client
app.use(express.json());
// to parse cookies sent from client
app.use(cookieParser(process.env.JWT_SECRET));
// to log HTTP requests to terminal
app.use(morgan('tiny'))

app.get('/', (req, res) => {
    res.send("Hello World")
})

app.use("/api/v1/auth", authRoutes);

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
