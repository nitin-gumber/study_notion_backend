const Course = require("../models/Course");
const Category = require("../models/Category");

function getRandomInt(max) {
  return Math.floor(Math.random() * max); // returns a random integer from 0 to max
}

// *************** Create Category ***************
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Name and Description field is required",
      });
    }

    // create category in DB
    await Category.create({
      name: name,
      description: description,
    });

    // return response to user after creating category
    return res.status(200).json({
      success: true,
      message: "Category created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error while creating category",
      error: error.message,
    });
  }
};

// *************** Get All Category ***************
exports.showAllCategory = async (req, res) => {
  try {
    // get all the category from DB and return to user in response body
    const allCategory = await Category.find(
      {},
      {
        name: true,
        description: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "All tags return Successfully",
      data: allCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while get all the tags",
      error: error.message,
    });
  }
};

// *************** Category Page Details ***************
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "CategoryId is required",
      });
    }

    // Get courses for the selected category
    const selectedCategory = await Category.findById(categoryId).populate({
      path: "course",
      match: { status: "Published" },
      populate: {
        path: "ratingAndReview",
      },
    });

    if (!selectedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Check if courses are available for the selected category or not
    if (!selectedCategory.course || selectedCategory.course.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses available for the selected category",
      });
    }

    // Get a random course from a different category
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId }, // $ne is not equal to
    });
    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "course",
        match: { status: "Published" },
        populate: {
          path: "ratingAndReview",
        },
      })
      .exec();

    // Get most selling courses from all categories
    const allCategories = await Category.find()
      .populate({
        path: "course",
        match: { status: "Published" },
        populate: {
          path: "ratingAndReview",
        },
      })
      .exec();
    const allCourses = allCategories.flatMap((category) => category.courses); // flatMap is used to flatten the array of arrays
    const mostSellingCourses = allCourses // sort courses based on sold count and get top 10 courses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    // return response to user with selected category, different category and most selling courses
    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// *************** Add Course To Category ***************
exports.addCourseToCategory = async (req, res) => {
  try {
    const { courseId, categoryId } = req.body;

    if (!courseId || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "CourseId and CategoryId is required",
      });
    }

    // find Course by Id
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // find Category by Id
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // check if course already added to category or not
    if (category.courses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Course already added to category",
      });
    }
    category.courses.push(courseId);
    await category.save();

    // return response to user after adding course to category
    return res.status(200).json({
      success: true,
      message: "Course added to category successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while adding course to category",
      error: error.message,
    });
  }
};
