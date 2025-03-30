const express = require("express");
const multer = require("multer");
const Community = require("../models/community"); // Import the Group model
const router = express.Router();


const formidable = require("formidable");

const cloudinary = require('../cloudinaryConfig');



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

        
        const newCommunity = new Community({
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

        console.log("new community before saving");
        console.log(newCommunity);

 

        await newCommunity.save();

        res.status(201).json({ message: "Community created successfully!", community: newCommunity });
      } catch (error) {
        console.error("Error creating community:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Unexpected Error", error: error.message });
  }
});


router.get("/get/all", async (req, res) => {
  try {
    const communities = await Community.find().populate("members posts");
    res.json(communities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



router.get("/:groupId", async (req, res) => {
  try {
    const com = await Community.findById(req.params.groupId)
      .populate("admins", "name")
      .populate({
        path: "posts",
        populate: { path: "author", select: "name" }
      });

    if (!com) return res.status(404).json({ error: "Community not found" });

    res.json(com);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


// Join Community
router.post("/:comId/join", async (req, res) => {
  try {
    const { userId } = req.body;
    const { comId } = req.params;

    console.log(userId);
    console.log(comId);

    const community = await Community.findById(comId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Check if user is already a member
    if (community.members.includes(userId)) {
      return res.status(400).json({ message: "User is already a member" });
    }

    // Add user to group
    community.members.push(userId);
    await community.save();

    res.status(200).json({ message: "Joined the community successfully", community });
  } catch (error) {
    console.error("Error joining community:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get the last 3 members who joined a community
router.get("/:id/recent-members", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the community and get the last 3 members
    const community = await Community.findById(id).populate({
      path: "members",
      options: { sort: { _id: -1 }, limit: 3 }, // Assuming _id follows insertion order
    });

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.json({ recentMembers: community.members });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
