const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// *************** Create SubSection ***************
exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, description } = req.body;

    // get files/video from req.files
    const video = req.files.video;

    if (!sectionId || !title || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check if section exist or not in DB
    const ifSectionExist = await Section.findById(sectionId);
    if (!ifSectionExist) {
      return res.status(400).json({
        success: false,
        message: "Section not found",
      });
    }

    // upload video to Cloudinary and get the details
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.CLOUDINARY_FOLDER_NAME
    );

    // create a new SubSection in DB with necessary details
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    // update SubSection With section in DB
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: subSectionDetails._id } },
      { new: true }
    ).populate("subSection");

    // return response to user
    return res.status(200).json({
      success: true,
      message: "SubSection Created Successfully",
      data: updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error occur while creating SubSection",
      error: error.message,
    });
  }
};

// *************** update SubSection ***************

exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;
    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" });
    }

    // Update SubSection details
    if (title !== undefined) subSection.title = title;
    if (description !== undefined) subSection.description = description;

    // Upload video to Cloudinary and get the details
    if (req.files && req.files.video) {
      const uploadDetails = await uploadImageToCloudinary(
        req.files.video,
        process.env.CLOUDINARY_FOLDER_NAME
      );
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = Math.round(uploadDetails.duration);
    }

    // Save updated SubSection details
    await subSection.save();

    // Return updated section details
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );
    return res.json({
      success: true,
      message: "SubSection updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
      error: error.message,
    });
  }
};

// *************** Delete SubSection ***************
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    );
    const subSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" });
    }

    // find updated section and return it in response
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    return res.json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    });
  }
};
