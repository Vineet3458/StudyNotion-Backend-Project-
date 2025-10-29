const express = require("express");
const router = express.Router();

const {
    login,
    singUp,
    sendOTP,
    changePassword,
} = require("../controllers/Auth");

const {
    resetPasswordToken,
    resetPassword,
} = require("../controllers/ResetPassword");

const {auth} = require("../middlewares/auth");

//Routes for User login
router.post("/login", login);

//Router for User Signup
router.post("/signup", singUp);

//Router for sending OTP to the User's email
router.post("/sendotp", sendOTP);

//Router for Change Password
router.post("/change-password", changePassword);

//Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken);

//Router for resetting user's password after verification
router.post("/reset-password", resetPassword);

//Export the router for use in the main application
module.exports = router;