const mongoose = require("mongoose")

const PostDetails = new mongoose.Schema({
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    image : {
        type : String,
    },
    text : {
        type : String,
    },
    likes: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    comments: [
        {user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
},{timestamps : true})

// PostDetails.pre("save", function(next){
//     if(!this.image && !this.text) return next(new Error("Either image or text is required"))
    
//     next()


module.exports = mongoose.model("Post", PostDetails)