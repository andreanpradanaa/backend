const express = require("express");
const multer = require("multer");
const router = express.Router();
const Clients = require("../model/clients");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/clients ");
  },

  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const uploads = multer({ storage: storage });

router.get("/", (req, res) => {
  Clients.find()
    .then((client) => res.json(client))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.post("/add", uploads.single("gambar"), (req, res) => {
  const newClient = new Clients({
    nama: req.body.nama,
    gambar: req.file.originalname,
  });

  newClient
    .save()
    .then(() => res.json("added succes!"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.get("/:id", (req, res) => {
  Clients.findById(req.params.id)
    .then((client) => res.json(client))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.put("/update/:id", uploads.single("gambar"), (req, res) => {
  Clients.findById(req.params.id)
    .then((client) => {
      client.nama = req.body.nama;
      client.gambar = req.file.originalname;

      client
        .save()
        .then(() => res.json("updated success!"))
        .catch((err) => res.status(400).json(`Error: ${err}`));
    })

    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.delete("/:id", (req, res) => {
  Clients.findByIdAndDelete(req.params.id)
    .then(() => res.json("deleted success!"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
