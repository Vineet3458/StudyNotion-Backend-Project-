const Category = require("../models/Categories");

//Create Category handler function
exports.createCategory = async (req, res) => {
    try{
        //Fetch data 
        const {name, description} = req.body;

        //Validation 
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: " All fields are required",
            });
        }

        //Create DB entry 
        const categoryDetails = await Category.create({
            name: name,
            description: description,
        });

        console.log(categoryDetails);

        //return response
        return res.status(200).json({
            success: true,
            message: "Category created Successfully",
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}


//showAllCategory handler function
exports.showAllCategory = async (req, res) => {
    try{
        const allCategory = await Category.find({}, {name: true , description: true});
        return res.status(200).json({
            success: true,
            message: "All Category return successfully",
            allCategory,
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}


//categoryPageDetails
exports.categoryPageDetails = async (req, res) => {
    try{
        //get categoryId
        const {categoryId} = req.body;

        //get courses for specified categoryId
        const selectedCategory = await Category.findById(categoryId)
                                                        .populate("courses")
                                                        .exec();

        //Validation
        if(!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Data Not Found",
            });
        }

        //get courses for different categories
        const differentCategories = await Category.find({
                                                        _id: {$ne: categoryId},
                                                        })
                                                        .populate("courses")
                                                        .exec();

        //get top selling courses

        //return Response
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategories,
            },
        });
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}