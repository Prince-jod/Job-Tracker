const Job = require("../models/Job");

// ✅ Create Job
const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Jobs
const getJobs = async (req, res) => {
  const jobs = await Job.find({ user: req.user._id });
  res.json(jobs);
};

// ✅ Delete Job
const deleteJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  await job.deleteOne();
  res.json({ message: "Job deleted" });
};
const updateJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  // update job
  const updatedJob = await Job.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedJob);
};

module.exports = {
  createJob,
  getJobs,
  deleteJob,
  updateJob,
};