const mongoose = require("mongoose");
const artistSchema = new mongoose.Schema({
    a_name: {
        type: String,
        required: true
    },
    Dob: {
        type: String,
        required: true, 
    },
    bio: {
        type: String,
        required: true, 
    },
    
});

module.exports = mongoose.model("artists", artistSchema);