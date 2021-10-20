let express = require('express');
let mongoose = require('mongoose');

let app = express();
const cors = require('cors');

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

mongoose.connect('mongodb://localhost/my-cv', { useNewUrlParser: true});
var db = mongoose.connection;


if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")


var port = process.env.PORT || 8080;
const options = {
    origin: 'http://localhost:4200',
    }

app.use(cors(options))

//routes
require('./routes/restricted-access-routes')(app);
require('./routes/all-access-routes')(app);

app.listen(port, function () {
    console.log("My CV API is listening on port " + port);
});