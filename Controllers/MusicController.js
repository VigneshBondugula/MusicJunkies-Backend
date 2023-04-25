import {MusicData} from "../Data/Music.js"
import Music from "../Models/MusicModel.js"
import asyncHandler from "express-async-handler"

//PUBLIC
//@desc import music
//@route POST /api/music/import
//@access Public
const importMusic = asyncHandler(async (req, res) => 
{
    try{
        await Music.deleteMany({});
        const music = await Music.insertMany(MusicData);
        res.status(201).json(music);
    } catch (error) {
    res.status(400).json({message: error.message})
    }
});

//@desc get all music
//@route GET /api/music
//@access Public
const getMusic =  asyncHandler(async (req, res) => 
{
    try {
        const {artist, genre, language, year, search } = req.query;
        let query = {
            ...(artist && {artist}),
            ...(genre && {genre}),
            ...(language && {language}),
            ...(year && {year}),
            ...(search && {title : {$regex: search, $options:"i"}}),
        }
        const page = Number(req.query.pageNumber) || 1;
        const limit = 2;
        const skip = (page-1)*limit;

        const music = await Music.find(query)
                            .sort({createdAt : -1})
                            .skip(skip)
                            .limit(limit);

        const count = await Music.countDocuments(query);
        res.json({
            music, 
            page,
            pages : Math.ceil(count/limit),
            totalMusic : count
        })
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});


//@desc get music
//@route GET /api/music/:id
//@access Public
const getMusicbyId =  asyncHandler(async (req, res) => 
{
    try {
       const music = Music.findById(req.params.id);
       if(music){
        res.json(music);
       }
       else{
        res.status(404);
        throw new Error("Music not found");
       }
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});

//@desc get top music
//@route GET /api/music/top
//@access Public
const getTopMusic =  asyncHandler(async (req, res) =>
{
    try {
        const music = await Music.find({}).sort({rating : -1}).limit(5);
        res.json(music);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});


//PRIVATE

//@desc create music review
//@route POST /api/music/:id/reviews
//@access Private
const createMusicReview =  asyncHandler(async (req, res) =>
{
    try {
        const {rating, comment} = req.body;
        const music = await Music.findById(req.params.id);
        if(music){
            const alreadyReviewed = music.reviews.find(r => r.user.toString() === req.user._id.toString());
            if(alreadyReviewed){
                res.status(400);
                throw new Error("Music already reviewed");
            }
            const review = {
                userName: req.user.fullName,
                rating: Number(rating),
                comment,
                user: req.user._id
            }
            music.reviews.push(review);
            music.numberOfReviews = music.reviews.length;
            music.rating = music.reviews.reduce((acc, item) => item.rating + acc, 0) / music.reviews.length;
            await music.save();
            res.status(201).json({message: "Review added"});
        }
        else{
            res.status(404);
            throw new Error("Music not found");
        }
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});


//ADMIN

//@desc delete music   
//@route DELETE /api/music/:id
//@access Private/Admin
const deleteMusic =  asyncHandler(async (req, res) =>
{
    try {
        const music = await Music.findById(req.params.id);
        if(music){
            await music.remove();
            res.json({message: "Music removed"});
        }
        else{
            res.status(404);
            throw new Error("Music not found");
        }
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});


//@desc update music
//@route PUT /api/music/:id
//@access Private/Admin
const updateMusic =  asyncHandler(async (req, res) =>
{
    try {
        const {title, artist, genre, year, track, duration, path, cover, language, lyrics} = req.body;
        const music = await Music.findById(req.params.id);
        if(music){
            music.title = title;
            music.artist = artist;
            music.genre = genre;
            music.year = year;
            music.track = track;
            music.duration = duration;
            music.path = path;
            music.cover = cover;
            music.language = language;
            music.lyrics = lyrics;
            const updatedMusic = await music.save();
            res.json(updatedMusic);
        }
        else{
            res.status(404);
            throw new Error("Music not found");
        }
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});

//@desc create music
//@route POST /api/music
//@access Private/Admin
const createMusic =  asyncHandler(async (req, res) =>
{
    const {title, artist, genre, year, track, duration, path, cover, language, lyrics} = req.body;
    try {
        const music = new Music({
            userId: req.user._id,
            title: title,
            artist: artist,
            genre: genre,
            year: year,
            track: track,
            duration: duration,
            path: path,
            cover: cover,
            language: language,
            lyrics: lyrics,
            rating: 0,
            numberOfReviews : 0,
            reviews: []
        });
        const createdMusic = await music.save();
        res.status(201).json(createdMusic);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});
export {importMusic, getMusic, getMusicbyId, getTopMusic, createMusicReview, deleteMusic, updateMusic, createMusic};