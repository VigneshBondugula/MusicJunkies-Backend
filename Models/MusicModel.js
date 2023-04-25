import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},
{
    timestamps:true
});

const musicSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type:String,
        required:true
    },
    artist: {
        type:String,
        required:true
    },
    album: String,
    genre: {
        type:String,
        required:true
    },
    year: {
        type:Number,
        required:true
    },
    track: Number,
    duration: Number,
    path: String,
    cover: String,
    language: String,
    lyrics: String,
    rating: Number,
    numberOfReviews : {
        type:Number,
        required:true
    },
    reviews: [reviewSchema]
},
{
    timestamps:true
});

export default mongoose.model("Music", musicSchema);