const mongoose = require("mongoose");
const SubSection = require("./SubSection");
const sectionSchema = new mongoose.Schema({
    sectionName:{
        type: String,
        require: true,
        trim: true,
    },
    subSection:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSection",
            require: true,
        }
    ],
});

module.exports = mongoose.model("Section", sectionSchema);