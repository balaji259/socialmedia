const express = require("express");
const multer = require("multer");
const Group = require("../models/group"); // Import the Group model
const router = express.Router();

// const cloudinary = require('../cloudinaryConfig');
const formidable = require("formidable");
// const cloudinary = require("cloudinary").v2;
const cloudinary = require('../cloudinaryConfig');

// Multer storage configuration (stores files in "uploads" folder)
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
// const upload = multer({ storage: storage });

// router.post(
//   "/create",
//   upload.fields([{ name: "profilePicture" }, { name: "coverPhoto" }]),
//   async (req, res) => {
//     try {
//       console.log("Received form data:", req.body);
//       console.log("Uploaded Files:", req.files);

//       const {
//         name,
//         category,
//         description,
//         privacy,
//         joinMethod,
//         allowPosts,
//         allowComments,
//         requireApproval,
//         createdBy,
//       } = req.body;

//       // Ensure required fields are provided
//       if (!name || !category || !createdBy) {
//         return res.status(400).json({ message: "Name, category, and createdBy are required!" });
//       }

//       // Validate category against enum values
//       const validCategories = ["Academic Club", "Sports Team", "Student Organization"];
//       if (!validCategories.includes(category)) {
//         return res.status(400).json({ message: "Invalid category!" });
//       }

//       // Validate privacy and joinMethod against enum values
//       const validPrivacy = ["public", "college", "members"];
//       if (privacy && !validPrivacy.includes(privacy)) {
//         return res.status(400).json({ message: "Invalid privacy value!" });
//       }

//       const validJoinMethods = ["anyone", "approval", "invitation"];
//       if (joinMethod && !validJoinMethods.includes(joinMethod)) {
//         return res.status(400).json({ message: "Invalid joinMethod value!" });
//       }

//       // File handling (if uploaded)
//       const profilePicture = req.files["profilePicture"] ? req.files["profilePicture"][0].path : null;
//       const coverPhoto = req.files["coverPhoto"] ? req.files["coverPhoto"][0].path : null;

//       // Create new group
//       const newGroup = new Group({
//         name,
//         category,
//         description,
//         profilePicture,
//         coverPhoto,
//         createdBy,
//         privacy: privacy || "public",
//         joinMethod: joinMethod || "anyone",
//         permissions: {
//           allowPosts: allowPosts === "true",
//           allowComments: allowComments === "true",
//           requireApproval: requireApproval === "true",
//         },
//       });

//       // Save to database
//       await newGroup.save();

//       res.status(201).json({ message: "Group created successfully!", group: newGroup });
//     } catch (error) {
//       console.error("Error creating group:", error);
//       res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
//   }
// );



// GET all groups
router.get("/get/all", async (req, res) => {
  try {
    const groups = await Group.find().populate("members posts");
    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



// // /Cloudinary storage configuration
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "group_images", // Cloudinary folder name
//     allowed_formats: ["jpg", "png", "jpeg"],
//     // transformation: [{ width: 500, height: 500, crop: "limit" }], // Optional image resizing
//   },
// });

// const upload = multer({ storage });



router.post("/create", async (req, res) => {
  try {
    const form = new formidable.IncomingForm({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parsing error:", err);
        return res.status(400).json({ error: "Failed to parse form data" });
      }

      const parsedFields = Object.fromEntries(
        Object.entries(fields).map(([key, value]) => [key, value[0]])
      );

      console.log("Received form fields:", parsedFields);
      console.log("Received form files:", files);

      console.log("Profile Picture Path:", files.profilePicture?.[0]?.filepath);
      console.log("Cover Photo Path:", files.coverPhoto?.[0]?.filepath);


      const {
        name,
        category,
        description,
        visibility, // Fixed: Previously privacy was undefined
        joinMethod,
        allowPosts,
        allowComments,
        requireApproval,
        createdBy,
      } = parsedFields;

      if (!name || !category || !createdBy) {
        return res.status(400).json({ message: "Name, category, and createdBy are required!" });
      }

      const validCategories = ["Academic Club", "Sports Team", "Student Organization"];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ message: "Invalid category!" });
      }

      const validVisibility = ["public", "college", "members"];
      if (visibility && !validVisibility.includes(visibility)) {
        return res.status(400).json({ message: "Invalid visibility value!" });
      }

      const validJoinMethods = ["anyone", "approval", "invitation"];
      if (joinMethod && !validJoinMethods.includes(joinMethod)) {
        return res.status(400).json({ message: "Invalid joinMethod value!" });
      }

      try {
        let profilePictureUrl = null;
        let coverPhotoUrl = null;

        if (files.profilePicture && files.profilePicture.length > 0) {
          const uploadResult = await cloudinary.uploader.upload(files.profilePicture[0].filepath, {
            folder: "group_profile_pics",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
          });
          profilePictureUrl = uploadResult.secure_url;
        }

        if (files.coverPhoto && files.coverPhoto.length > 0) {
          const uploadResult = await cloudinary.uploader.upload(files.coverPhoto[0].filepath, {
            folder: "group_cover_photos",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
          });
          coverPhotoUrl = uploadResult.secure_url;
        }



        console.log("coverPhotoUrl");
        console.log(coverPhotoUrl);
        console.log("profilePhotoUrl");
        console.log(profilePictureUrl);

        
        const newGroup = new Group({
          name,
          category,
          description,
          profilePicture: profilePictureUrl,
          coverPhoto: coverPhotoUrl,
          createdBy,
          visibility: visibility || "public",
          joinMethod: joinMethod || "anyone",
          permissions: {
            allowPosts: allowPosts === "true",
            allowComments: allowComments === "true",
            requireApproval: requireApproval === "true",
          },
        });

        await newGroup.save();

        res.status(201).json({ message: "Group created successfully!", group: newGroup });
      } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Unexpected Error", error: error.message });
  }
});


router.get("/:groupId", async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate("admins", "name")
      .populate({
        path: "posts",
        populate: { path: "author", select: "name" }
      });

    if (!group) return res.status(404).json({ error: "Group not found" });

    res.json(group);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


// Join Group
router.post("/:groupId/join", async (req, res) => {
  try {
    const { userId } = req.body;
    const { groupId } = req.params;

    console.log(userId);
    console.log(groupId);

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is already a member
    if (group.members.includes(userId)) {
      return res.status(400).json({ message: "User is already a member" });
    }

    // Add user to group
    group.members.push(userId);
    await group.save();

    res.status(200).json({ message: "Joined the group successfully", group });
  } catch (error) {
    console.error("Error joining group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get the last 3 members who joined a community
router.get("/:id/recent-members", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the community and get the last 3 members
    const group = await Group.findById(id).populate({
      path: "members",
      options: { sort: { _id: -1 }, limit: 3 }, // Assuming _id follows insertion order
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json({ recentMembers: group.members });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
