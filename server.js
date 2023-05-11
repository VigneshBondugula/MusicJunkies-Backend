import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRouter from "./Routes/UserRouter.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import musicRouter from "./Routes/MusicRouter.js";

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

//-----MIDDLEWARE-----

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

app.use(cors(corsOptions));
app.use(express.json());

//error handling middleware
// app.use(errorMiddleware)

// get driver connection

connectDB();
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

app.get('/', (req, res) => {
    res.send('API is running');
});

app.use("/api/users", userRouter)
app.use("/api/music", musicRouter)
