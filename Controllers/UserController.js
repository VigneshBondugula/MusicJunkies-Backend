import asynchandler from 'express-async-handler';
import { generateToken } from '../middlewares/Auth.js';
import User from '../Models/UserModel.js';
import bcrypt from 'bcryptjs';

// @desc    Register user & get token
// @route   POST /api/users/register
// @access  Public
const registerUser = asynchandler(async (req, res) => {
    const {fullname, email, password, image, isAdmin} = req.body;
    try {
        const userexists = await User.findOne({email});
        if (userexists) {
            res.status(400);
            throw new Error("User already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            fullname,
            email,
            password: hashedPassword,
            image,
            isAdmin,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                isAdmin: user.isAdmin,
                image: user.image,
                token: generateToken(user._id),
            });
        } 
        else {
            res.status(400);
            throw new Error("Invalid user data");
        }

    } catch (error) {
        res.status(400).json({message : error.message});
    }
});


// @desc   Login user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asynchandler(async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                isAdmin: user.isAdmin,
                image: user.image,
                token: generateToken(user._id),
            });
        }
        else {
            res.status(401);
            throw new Error("Invalid email or password");
        }
    }
    catch (error) {
        res.status(400).json({message : error.message});
    }
});


//PRIVATE ROUTES

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asynchandler(async (req, res) => {
    const {fullname, email, image} = req.body;
    try {
        const user = await User.findOne(req.user._id);

        if (user) {
            user.fullname = fullname || user.fullname;
            user.email = email || user.email;
            user.image = image || user.image;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                fullname: updatedUser.fullname,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                image: updatedUser.image,
                token: generateToken(updatedUser._id),
            });
        }
        else {
            res.status(404);
            throw new Error("User Not Found");
        }
    }
    catch (error) {
        res.status(400).json({message : error.message});
    }
});


// @desc Change user password
// @route PUT /api/users/password
// @access Private
const changePassword = asynchandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    try {
        const user = await User.findOne(req.user._id);

        if (user && await bcrypt.compare(oldPassword, user.password)) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            user.password = hashedPassword;
            const updatedUser = await user.save();

            res.json({
                message : "Password changed successfully",
            });
        }
        else if (user && !await bcrypt.compare(oldPassword, user.password)) {
            res.status(404);
            throw new Error("Invalid Old Password");
        }
        else {
            res.status(404);
            throw new Error("Invalid user");
        }
    }
    catch (error) {
        res.status(400).json({message : error.message});
    }
});

// @desc Add user favorites
// @route POST /api/users/favorites
// @access Private
const addUserFavorites = asynchandler(async (req, res) => {
    const {musicId} = req.body;
    try {
        const user = await User.findOne(req.user._id).populate('likedMusic');

        if (user) {
            if (user.likedMusic.find((music) => music._id.toString() === musicId)) {
                res.status(400);
                throw new Error("Music already added to favorites");
            }
            user.likedMusic.push(musicId);
            await user.save();
            res.json(user.likedMusic);
        }
        else {
            res.status(404);
            throw new Error("User not found");
        }
    }
    catch (error) {
        res.status(400).json({message : error.message});
    }
});

// @desc Get user favorites
// @route GET /api/users/favorites
// @access Private
const getUserFavorites = asynchandler(async (req, res) => {
    try {
        const user = await User.findOne(req.user._id).populate('likedMusic');

        if (user) {
           res.json(user.likedMusic);
        }
        else {
            res.status(404);
            throw new Error("User not found");
        }
    }
    catch (error) {
        res.status(400).json({message : error.message});
    }
});
    
// @desc Delete all favorites
// @route DELETE /api/users/favorites
// @access Private
const deleteUserFavorites = asynchandler(async (req, res) => {
    try {
        const user = await User.findOne(req.user._id);
        if(user){
            user.likedMusic = [];
            await user.save();
            res.json({message:"All favorites deleted"});
        }
        else{
            res.status(404);
            throw new Error("User not found");
        }
    }
    catch (error) {
        res.status(400).json({message : error.message});
    }
});

//ADMIN ROUTES

// @desc Get all users
// @route GET /api/users
// @access Private/Admin
const getUsers = asynchandler(async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    }
    catch (error) {
        res.status(400).json({message : error.message});
    }
});

// @desc Delete users
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asynchandler(async (req, res) => {
    try {
        const users = await User.findByIdAndDelete(req.params.id);
        res.json(users);
    }
    catch (error) {
        res.status(400).json({message : error.message});
    }
});
export {registerUser, loginUser, updateUserProfile, changePassword, addUserFavorites,getUserFavorites, getUsers, deleteUser, deleteUserFavorites};