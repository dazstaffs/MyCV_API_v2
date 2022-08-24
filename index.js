let express = require("express");
let mongoose = require("mongoose");
const schedulerController = require("./controllers/scheduleController");

let app = express();
const cors = require("cors");

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

mongoose.connect("mongodb://localhost/my-cv", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Database Connected Successfully");
});

var port = process.env.PORT || 8080;
const options = {
  origin: "http://localhost:4200",
};

app.use(cors(options));

schedulerController.scheduledTask();

//routes
require("./routes/restricted-access-routes")(app);
require("./routes/all-access-routes")(app);

app.listen(port, function () {
  console.log("My CV API is listening on port " + port);
});
