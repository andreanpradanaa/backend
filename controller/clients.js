const express = require("express");
const multer = require("multer");
const router = express.Router();
const Clients = require("../model/clients");
const path = require("path");

var storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
var imageFilter = function (req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
var uploads = multer({ storage: storage, fileFilter: imageFilter });

var cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "apaaja2001",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "./uploads/clients ");
//   },

//   filename: (req, file, callback) => {
//     callback(null, file.originalname);
//   },
// });

// const uploads = multer({ storage: storage });

router.get("/", (req, res) => {
  Clients.find()
    .then((client) => res.json(client))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.post("/add", uploads.single("gambar"), (req, res) => {
  cloudinary.uploader.upload(req.file.path, function (result) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    // add cloudinary url for the image to the campground object under image property
    req.body.client.gambar = result.secure_url;
    req.body.client.nama = req.user.nama;
    // add author to client

    Client.create(req.body.client, function (err, client) {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("back");
      }
      res.redirect("/client/" + client.id);
    });
  });

  // const newClient = new Clients({
  //   nama: req.body.nama,
  //   gambar: req.file.originalname,
  // });
  // newClient
  //   .save()
  //   .then(() => res.json("added succes!"))
  //   .catch((err) => res.status(400).json(`Error: ${err}`));
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
