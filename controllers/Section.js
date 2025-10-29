const Section = require("../models/Section");
const Course = require("../models/Course");

//Create Section
exports.createSection = async (req, res) => {
    try{
        //Data fetch
        const  {sectionName, courseId} = req.body;
    
        //Data Validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: 'Missing Properties',
            });
        }

        //Create Section
        const newSection = await Section.create({sectionName});

        //Update course with section ObjectID
        const updateCourseDetails = await Course.findByIdAndUpdate(
                                                                    courseId,
                                                                    {
                                                                        $push : {
                                                                            courseContent: newSection._id,
                                                                        }
                                                                    },
                                                                    {new: true},
                                                                );
        
        //return response
        return res.status(200).json({
            success:true,
            message: 'Section Created Successfully',
            updateCourseDetails,
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Unable to create Section, please try again",
            error: err.message,
        });
    }
}


//Update Section
exports.updateSection = async (req, res) => {
    try{
        //date fetch
        const {sectionName, sectionId} = req.body;

        //Validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: 'Missing Properties',
            });
        }

        //Update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new: true});

        //return response
        return res.status(200).json({
            success: true,
            message: 'Section Updated Successfully',
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: " Failed to Update Section, please try again",
            message: err.message,
        });
    }
}


//Delete Section
exports.deleteSection = async (req, res) => {
    try{
        //Get ID
        const {sectionId} = req.param;

        //use findByIdAndDelete
        await Section.findByIdAndDelete(sectionId);

        //return response
        return res.status(200).json({
            success: true,
            message: " Section Deleted Successfully",
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: " Failed to Delete Section, please try again",
            message: err.message,
        });
    }
}