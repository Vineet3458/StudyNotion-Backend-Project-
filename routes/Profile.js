const express = require("express");
const router = express.Router();

const {auth} = require("../middlewares/auth");

const {
    deleteAccount,
    updateProfile,
    getAllUserDetails,
} = require("../controllers/Profile");

router.post("/deleteAccount", auth, deleteAccount);
router.post("/updateProfile", updateProfile);
router.post("/getAllUserDetails", getAllUserDetails);

//Export the router for use in the main application
module.exports = router;