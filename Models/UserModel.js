import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Please provide a fullname"],
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    image: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    likedMusic: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Music",
        }
    ],
},
{   
    timestamps: true,
}
);

export default mongoose.model("User", UserSchema);