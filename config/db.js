const mongoose = require("mongoose");

mongoose.set('strictQuery', true);
mongoose.set('bufferCommands', false);

require("dotenv").config();

module.exports.db_connect = () => mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
    keepAliveInitialDelay: 300000
  }).then(db => {
    console.log(`Database connected ✅`)
  })
  .catch((error) => console.log(error));
