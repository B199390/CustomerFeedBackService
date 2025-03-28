

const express = require("express");
const Feedback = require("../models/Feedback");
require("dotenv").config();

const router = express.Router();

router.post("/submit", async (req, res) => {
  try {
    const { category, rating, comments } = req.body;
    const user = req.user;

    if (!category || !rating || !comments) {
      return res.json({ message: "Fill all fields" });
    }

    if (!user || !user._id) {
      return res.json({ message: "Login first" });
    }

    const newFeedback = new Feedback({ category, rating, comments, createdAt: new Date(), user: user._id });
    const savedFeedback = await newFeedback.save();
    res.json({ message: "Feedback added", feedback: savedFeedback });
  } catch (error) {
    res.json({ message: "Something went wrong" });
  }
});

router.get("/all-feedbacks", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({ feedbacks });
  } catch (error) {
    res.json({ message: "Error loading feedbacks" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.json({ message: "Feedback not found" });
    }
    res.json({ message: "Feedback removed" });
  } catch (error) {
    res.json({ message: "Error deleting" });
  }
});

router.put("/edit/:id", async (req, res) => {
  try {
    const { category, rating, comments } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, { category, rating, comments }, { new: true });

    if (!feedback) {
      return res.json({ message: "Feedback not found" });
    }

    res.json({ message: "Feedback updated", feedback });
  } catch (error) {
    res.json({ message: "Error updating" });
  }
});

module.exports = router;

