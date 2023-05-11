import express, { Router } from 'express';
import { importMusic, getMusic, getRandomMusic, getMusicbyId, getTopMusic, createMusicReview, createMusic, updateMusic, deleteMusic } from '../Controllers/MusicController.js';
import {protect, admin} from '../middlewares/Auth.js';

const musicRouter = express.Router();

//PUBLIC ROUTES
musicRouter.post("/import", importMusic);
musicRouter.get("/", getMusic);
musicRouter.get("/song/:id", getMusicbyId);
musicRouter.get("/top", getTopMusic);
musicRouter.get("/random", getRandomMusic);
//PRIVATE ROUTES
musicRouter.post("/review/:id", protect, createMusicReview);
//ADMIN ROUTES
musicRouter.post("/", protect, admin, createMusic);
musicRouter.put("/:id", protect, admin, updateMusic);
musicRouter.delete("/:id", protect, admin, deleteMusic);
export default musicRouter;