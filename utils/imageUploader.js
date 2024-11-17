const cloudinary = require("cloudinary").v2;

// Upload Assets to cloudinary
exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  const options = { folder };
  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }

  options.resource_type = "auto";

  return await cloudinary.uploader.upload(file.tempFilePath, options);
};

// Delete Assets from cloudinary
exports.deleteAssetsFromCloudinary = async (publicId, folder, resourceType) => {
  const fullPublicId = folder ? `${folder}/${publicId}` : publicId;

  try {
    const result = await cloudinary.uploader.destroy(fullPublicId, {
      resource_type: resourceType,
    });

    return result;
  } catch (error) {
    throw error;
  }
};
