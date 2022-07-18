const mongoose = require("mongoose");
const songsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    Dor:{
        type: String,
        required: true,
    },
    Artists:{
        type: String,
        required: true, 
    },
    image: {
        type: String,
        required: true, 
    },
    created: {
        type: Date,
        required: true, 
        default: Date.now,
    },
});




module.exports = mongoose.model("songs", songsSchema);