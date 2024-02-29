import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
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
// to parse JSON requests
app.use(express.json());
// to log HTTP requests
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
