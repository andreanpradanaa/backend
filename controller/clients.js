const express = require("express");
const router = express.Router();
const Clients = require("../model/clients");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

router.get("/", async (req, res) => {
  try {
    let client = await Clients.find();
    res.json(client);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    // Find client by id
    let client = await Clients.findById(req.params.id);
    res.json(client);
  } catch (err) {
    console.log(err);
  }
});

router.post("/add", upload.single("gambar"), async (req, res) => {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    let client = new Clients({
      nama: req.body.nama,
      gambar: result.secure_url,
      cloudinary_id: result.public_id,
    });

    await client.save();
    res.json("Data berhasil ditambah!");
  } catch (err) {
    console.log(err);
  }
});

router.put("/update/:id", upload.single("gambar"), async (req, res) => {
  try {
    let client = await Clients.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(client.cloudinary_id);
    // Upload image to cloudinary
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }
    const data = {
      nama: req.body.nama || client.nama,
      gambar: result?.secure_url || client.gambar,
      cloudinary_id: result?.public_id || client.cloudinary_id,
    };
    client = await Clients.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.json("Data berhasil diupdate!");
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // Find client by id
    let client = await Clients.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(client.cloudinary_id);
    // Delete client from db
    await client.remove();
    res.json("Data berhasil dihapus!");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
