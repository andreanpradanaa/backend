const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  nama: { type: String },
  gambar: { type: String },
});

const Clients = mongoose.model("Clients", clientSchema);
module.exports = Clients;
