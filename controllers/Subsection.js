const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//Create SubSection 
exports.createSubSection = async (req, res) => {
    try{
        //Fetch Data from req body
        const {sectionId, title, timeDuration, description} = req.body;

        //extract file/video 
        const video = req.file.video;

        //validation
        if(!sectionId || !title || !timeDuration || !description){
            return res.status(400).json({
                success: false,
                message: 'All the fields Are required',
            });
        }

        //Upload video to Cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        //Create a sub-Section
        const subSectionDetails = await SubSection.create(
            {
                title: title,
                timeDuration: timeDuration,
                description: description,
                videoUrl: uploadDetails.secure_url,
            });

        //Update section with this sub section ObjectId
        const updatedSection = await Section.findByIdAndUpdate({_id: sectionId},
                                                                {
                                                                    $push: {
                                                                        subSection: SubSectionDetails._id,
                                                                    }
                                                                },
                                                            {new: true});

        //return response
        return res.status(200).json({
            success: true,
            message: 'Sub Section Created Successfully',
            updatedSection,
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

//Update SubSection

//delete SubSection