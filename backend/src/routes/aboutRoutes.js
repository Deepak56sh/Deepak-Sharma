const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  getAbout,
  updateAbout,
  addStat,
  deleteStat,
  addValue,
  deleteValue,
  addAward,
  deleteAward,
  addTeamMember,
  deleteTeamMember,
} = require("../controllers/aboutController");
const { protect, authorize } = require("../middleware/auth");

// ===== PUBLIC ROUTES =====
router.get("/", getAbout);

// ===== ADMIN ROUTES =====
router.use(protect);
router.use(authorize("admin", "super-admin"));

// ===== IMAGE UPLOAD (used for team image, award images, member images) =====
router.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        imageUrl: req.file.path,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ===== ABOUT =====
router.put("/", updateAbout);

// ===== STATS =====
router.post("/stats", addStat);
router.delete("/stats/:id", deleteStat);

// ===== VALUES =====
router.post("/values", addValue);
router.delete("/values/:id", deleteValue);

// ===== AWARDS =====
router.post("/awards", addAward);
router.delete("/awards/:id", deleteAward);

// ===== TEAM MEMBERS =====
router.post("/team", addTeamMember);
router.delete("/team/:id", deleteTeamMember);

module.exports = router;