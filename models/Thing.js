// data qui va gerer tout article mise en vente dans l'application
const mongoose = require("mongoose");
// creer le shémas :

const thingSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model("Thing", thingSchema);
