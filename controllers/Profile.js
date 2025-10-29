const Profile = require('../models/Profile');
const User = require('../models/User');

exports.updateProfile = async (req, res) => {
    try{
        //Get Data
        const {dateOfBirth="", about="", contactNumber, gender} = req.body;

        //get userId
        const id = req.user.id;

        //validation
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success: false,
                message: 'All fields are Required',
            });
        }

        //Find Profile 
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();
        
        //return response
        return res.status(200).json({
            success: true,
            message: 'Profile Updated Successfully',
            profileDetails,
        });
    }
    catch{
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}


//Delete Account
exports.deleteAccount = async (req, res) =>{
    try{
        //get ID
        const id = req.user.id;

        //validation
        const userDetails = await User.findById({_id: id});
        if(!userDetails) {
            return res.status(404).json({
                success: false,
                message: 'User not Found',
            });
        }

        //delete profile
        await Profile.findByIdAndDelete({_id: userDetails.additionalDetails})
        
        //TODO: unenroll user from all enrolled courses

        //delete user
        await User.findByIdAndDelete({_id: id});

        //return response
        return res.status(200).json({
            success: true,
            message: 'User Deleted successfully',
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: 'User cannot be deleted successfully',
        });
    }
}


//Get All User Details
exports.getAllUserDetails = async (req, res) => {
    try{
        //Get ID
        const id = req.user.id;

        //Validation and Get user details
        const userDetails = await User.findById(id).populate("additionDetails").exec();

        //return response
        return res.status(200).json({
            success: true,
            message: 'User Data Fetched Successfully',
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch User Data',
        });
    }
}