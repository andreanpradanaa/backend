const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamSchema = new Schema({
  nama: { type: String },
  jabatan: { type: String },
  gambar: { type: String },
  cloudinary_id: { type: String },
});

const Teams = mongoose.model("Teams", teamSchema);
module.exports = Teams;
