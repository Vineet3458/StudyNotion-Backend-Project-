const Course = require("../models/Course");
const Category = require("../models/Categories");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

//createCourse handler function
exports.createCourse = async (req, res) => {
    try{
        //Fetch data 
        const { courseName, courseDescription, whatYouWillLearn, price, category} = req.body;

        //Get Thumbnail
        const thumbnail = req.files.thumbnailImage;

        //Validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        //Check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details ", instructorDetails);

        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: 'instructors Details not found',
            });
        }

        //Check given tag is valid or not 
        const categoryDetails = await Category.findById(tag);
        if(!categoryDetails){
            return res.status(404).json({
                success: false,
                message: 'Category Details not found',
            });
        }

        //Upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
        
        //create an entry for new course 
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
        });

        //add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            {new: true},
        );
        
        //Update the tag Schema
        // await tag.findByIdAndUpdate({tag},
        //     {
        //         $push: {
        //             tag: tagDetails._id,
        //         }
        //     },
        //     {new: true},
        // );

        //return response
        return res.status(200).json({
            success: true,
            message: " Course created successfully",
            data: newCourse,
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: " Failed to Create Course",
            message: err.message,
        });
    }
}


//getAllCourses handler function
exports.getAllCourses = async (req, res) => {
    try{
        const allCourses = await Course.find({},{ courseName: true,
                                                    price: true,
                                                    thumbnail: true,
                                                    instructor: true,
                                                    ratingAndReviews: true,
                                                    studentEnrolled: true,
                                                    })
                                                    .populate("instructor")
                                                    .exec();
                                                
        return res.status(200).json({
            success: true,
            message: "Data for all courses fetched successfully ",
            data: allCourses,
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: " Cannot Fetch course data",
            message: err.message,
        });
    }
}


//getCourseDetails
exports.getCourseDetails = async (req, res) => {
    try{
        //get Id
        const {courseId} = req.body;

        //find course details
        const courseDetails = await Course.find({_id: courseId})
                                                .populate(
                                                    {
                                                        path: "instructor",
                                                        populate: {
                                                            path: "additionalDetails",
                                                        },
                                                    }
                                                )
                                                .populate("category")
                                                //.populate("ratingAndReviews")
                                                .populate({
                                                    path: "courseContent",
                                                    populate: {
                                                        path: "subSection",
                                                    },
                                                })
                                                .exec();
        
        //Validation
        if(!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find the course with ${courseId}`,
            });
        }

        //return Response
        return res.status(200).json({
            success: true,
            message: "Course Details fetched successfully",
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message:error.message,
        });
    }
}