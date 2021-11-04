const express = require("express");
const router = express.Router();
const Teams = require("../model/teams");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

router.get("/", async (req, res) => {
  try {
    let team = await Teams.find();
    res.json(team);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    // Find team by id
    let team = await Teams.findById(req.params.id);
    res.json(team);
  } catch (err) {
    console.log(err);
  }
});

router.post("/add", upload.single("gambar"), async (req, res) => {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    let team = new Teams({
      nama: req.body.nama,
      jabatan: req.body.jabatan,
      gambar: result.secure_url,
      cloudinary_id: result.public_id,
    });

    await team.save();
    res.json("Data berhasil ditambah!");
  } catch (err) {
    console.log(err);
  }
});

router.put("/update/:id", upload.single("gambar"), async (req, res) => {
  try {
    let team = await Teams.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(team.cloudinary_id);
    // Upload image to cloudinary
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }
    const data = {
      nama: req.body.nama || team.nama,
      jabatan: req.body.jabatan || team.jabatan,
      gambar: result?.secure_url || team.gambar,
      cloudinary_id: result?.public_id || team.cloudinary_id,
    };
    team = await Teams.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.json("Data berhasil diupdate!");
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // Find team by id
    let team = await Teams.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(team.cloudinary_id);
    // Delete team from db
    await team.remove();
    res.json("Data berhasil dihapus!");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
