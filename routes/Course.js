const express = require("express");
const router = express.Router();

const {
    createCourse,
    getAllCourses,
    getCourseDetails,
} = require("../controllers/Course");

const { 
    categoryPageDetails,
    showAllCategory,
    createCategory,
} = require("../controllers/Category");

const {
    createSection,
    updateSection,
    deleteSection,
} = require("../controllers/Section");

const {
    createSubSection,
    // deleteSubSection,
    // updateSubSection,
} = require("../controllers/Subsection");

const {
    createRating,
    getAverageRating,
    getAllRating,
} = require("../controllers/RatingAndReview")

const {auth, isInstructor, isStudent, isAdmin} = require("../middlewares/auth");

router.post("/addSection", auth, isInstructor, createSection);
router.post("/updateSection", auth, isInstructor, updateSection);
router.post("/deleteSection", auth, isInstructor, deleteSection);

router.post("/createSubSection", auth, isInstructor, createSubSection);
// router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
// router.post("/updateSubSection", auth, isInstructor, updateSubSection);


router.post("/createCourse", auth, isInstructor, createCourse);
router.get("/getAllCourses", getAllCourses);
router.post("/getCourseDetails", getCourseDetails);

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategory", showAllCategory);
router.post("/getCategoryPageDetails", categoryPageDetails);

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating)

module.exports = router;
