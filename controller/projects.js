const express = require("express");
const router = express.Router();
const Projects = require("../model/projects");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

router.get("/", async (req, res) => {
  try {
    let project = await Projects.find();
    res.json(project);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    // Find project by id
    let project = await Projects.findById(req.params.id);
    res.json(project);
  } catch (err) {
    console.log(err);
  }
});

router.post("/add", upload.single("gambar"), async (req, res) => {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    let project = new Projects({
      judul: req.body.judul,
      deskripsi: req.body.deskripsi,
      gambar: result.secure_url,
      cloudinary_id: result.public_id,
    });

    await project.save();
    res.json(project);
  } catch (err) {
    console.log(err);
  }
});

router.put("/update/:id", upload.single("gambar"), async (req, res) => {
  try {
    let project = await Projects.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(project.cloudinary_id);
    // Upload image to cloudinary
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }
    const data = {
      judul: req.body.judul || project.judul,
      deskripsi: req.body.deskripsi || project.deskripsi,
      gambar: result?.secure_url || project.gambar,
      cloudinary_id: result?.public_id || project.cloudinary_id,
    };
    project = await Projects.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.json(project);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // Find project by id
    let project = await Projects.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(project.cloudinary_id);
    // Delete project from db
    await project.remove();
    res.json(project);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
