const cloudinary = require('cloudinary').v2;


exports.uploadImageToCloudinary = async (File, Folder, Height, quality) => {
    const options = {Folder};
    if(height){
        options.height = height;
    }
    if(quality){
        options.quality = quality;
    }
    options.resource_type = "auto";

    return await cloudinary.uploader.upload(File.tempFilePath, options);
}