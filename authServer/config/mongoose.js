const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/pixels", { useNewUrlParser: true });
module.exports = mongoose;