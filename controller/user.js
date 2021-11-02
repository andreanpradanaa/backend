const express = require("express");
const router = express.Router();
const User = require("../model/user");

router.get("/", (req, res) => {
  User.find()
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.get("/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.put("/update/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      user.username = req.body.username;
      user.password = req.body.password;

      user
        .save()
        .then(() => res.json({ message: "update success!" }))
        .catch((err) => res.status(400).json(`Error: ${err}`));
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.delete("/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json("deleted success!"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
