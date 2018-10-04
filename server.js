//at top of file
const MongoClient = require('mongodb').MongoClient



// call the packages we need
var express       = require('express');      // call express
var bodyParser    = require('body-parser');
var app           = express();     // define our app using express
// configure app to use bodyParser() and ejs
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs');
// get an instance of the express Router
var router = express.Router();
// a “get” at the root of our web app: http://localhost:3000/api
router.get('/', function(req, res) {
    res.render('index.ejs', {error: ""});
});
// all of our routes will be prefixed with /api
app.use('/api', router);
// START THE SERVER
//==========================================================


var db
MongoClient.connect('mongodb://yateslough:Yateslough1@ds223343.mlab.com:23343/trainproject', {useNewUrlParser:true}, (err, client) => {
    if(err) { console.log(err) }
    console.log("Connected successfully to server");
db = client.db('rollingStock')
app.listen(3000, () => {
    console.log('get');
})
})

//test comment
