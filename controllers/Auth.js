const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

//Send OTP
exports.sendOTP = async (req, res) => {
    
    try{
        //fetch email from request ki body
        const {email} = req.body;

        //Check if user already exist
        const checkUserPresent = await User.findOne({email});
        
        //if user already exist, then return a response 
        if(checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: 'User Already registered',
            });
        }

        //Generate OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP generated : ", otp);

        //Check unique otp or not
        const result = await OTP.findOne({otp : otp});

        while(result) {
            opt = otpGenerator(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
            });
            result = await OTP.findOne({otp : otp});
        }

        const otpPayload = {email, otp};

        //Create an entry for OTP
        const otpBody = await OTP.create(otpPayload);
        console.log(otpPayload);

        //Return response Successful
        res.status(200).json({
            success: true,
            message: 'OTP send Successfully',
            otp,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


//SingUp
exports.singUp = async(req, res) => {

    try{
        //Get data from body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        //Validating Everything
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success: false,
                message: " All fields are required",
            });
        }

        //Matching Both Password and ConfirmPassword
        if(password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password and ConfirmPassword Value does not match, Please try again',
            });
        }

        //Check if user already exist
        const existingUser = await User.findOne({email});
        if (existingUser){
            return res.status(400).json({
                success: false,
                message: 'User already Exists',
            });
        }

        //Find most Recent OTP stored for the user
        const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        console.log(recentOtp);

        //Validate OTP
        if(recentOtp.length == 0){
            //OTP not found 
            return res.status(400).json({
                success: false,
                message: 'OTP not found'
            });
        } 
        else if (otp !== recentOtp.otp){
            //invalid OTP
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        //Secure Password
        const hashedPassword = await bcrypt.hash(password, 10);

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        })

        //Create Entry for User
        const user = await User.create({
            firstName,
            lastName,
            email,
            password : hashedPassword,
            accountType,
            contactNumber,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        //return response successful 
       res.status(200).json({
            success: true,
            message: 'OTP send Successfully',
            otp,
        }); 
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


//LOGIN
exports.login = async (req, res) => {

    try{
        //Data Fetch
        const {email, password , accountType} = req.body;

        //Validate on email and Password
        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: 'Please fill all the details',
            });
        }

        //Check for registered user
        const user = await User.findOne({email}).populate("additionalDetails");

        //If not a Registered User 
        if(!user){
            return res.status(401).json({
                success: false,
                message: 'User is not registered',
            });
        }

        //Verify password and Generate a JWT token

        if (await bcrypt.compare(password, user.password)){

            const payload ={
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            };

            //password match 
            let token = jwt.sign(payload,
                process.env.JWT_SECRET,
                {
                    expiresIn:"2h",
                },
            );
            user.token = token;
            user.password = undefined;

            //Create cookie and Send response 
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }
            res.cookie("token",token, options).status(200).json({
                success:true,
                token,
                user,
                message: 'Logged in successfully',
            });
        }
        else{
            return res.status(401).json({
                success: false,
                message: 'Password is incorrect',
            });
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Login Failure, please try again',
        });
    }
}


//Change Password
exports.changePassword = async (req,res) => {

    try{
        //get data from req body
        //get oldPassword, newPassword, confirmPassword
        //Validation
        //update password in DB
        //Send mail - password updated
        //return response
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: '',
        });
    }
}