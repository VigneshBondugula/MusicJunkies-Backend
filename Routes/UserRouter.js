import express from 'express';
import { addUserFavorites, changePassword, deleteUser, deleteUserFavorites, getUserFavorites, getUsers, loginUser, registerUser, updateUserProfile} from '../Controllers/UserController.js';
import {protect, admin} from '../middlewares/Auth.js';

const userRouter = express.Router();

//PUBLIC ROUTES
userRouter.post("/", registerUser);
userRouter.post("/login", loginUser);

//PRIVATE ROUTES
userRouter.put("/", protect, updateUserProfile);
userRouter.put("/password", protect, changePassword);
userRouter.get("/favorites", protect, getUserFavorites);
userRouter.post("/favorites", protect, addUserFavorites);
userRouter.delete("/favorites", protect, deleteUserFavorites);
userRouter.delete("/:id", protect, deleteUser);

//ADMIN ROUTES
userRouter.get("/", protect, admin, getUsers);
export default userRouter;