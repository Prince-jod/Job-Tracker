const express = require("express");
const router = express.Router();

const {
  createJob,
  getJobs,
  deleteJob,
  updateJob, // ✅ add this
} = require("../controllers/jobControllers");

const { protect } = require("../middleware/authMiddleware");

// create
router.post("/", protect, createJob);

// get all
router.get("/", protect, getJobs);

// update ✅ (THIS IS WHAT YOU WERE MISSING)
router.put("/:id", protect, updateJob);

// delete
router.delete("/:id", protect, deleteJob);

module.exports = router;