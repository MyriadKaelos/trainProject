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

function RollingStock(w,t,m,h = 0){
    this.weight = w;
    this.id = getnextid();
    this.type = t;
    this.contents = [];
    this.makemodel = m;
    this.horsepower = h;
    this.addContent = function(c,w){
        this.contents.push([c,w]);
    }
}

function Train(){
    this.id = getnextid();
    this.engines = [];
    this.cars = [];
    this.origin = [];
    this.destination = [];
    this.addEngine = function(e){
        this.engines.push(e);
    };
    this.addCar = function(c){
        this.cars.push(c);
    };
    this.setOrigin = function(lat,long){
        this.origin = [lat,long];
    };
    this.setDestination = function(lat,long){
        this.destination = [lat,long];
    };
}

// function Company(n){
//     this.name = n;
//     this.id = getnextid();
//     this.fleet = [];
//     this.trains = [];
//     this.addToFleet = function(r){
//         this.fleet.push(r);
//     };
//     this.addTrain = function
// }

function getnextid(){
    return 4;
}


//ADD ROLLINGSTOCK ACTION
app.post('/api/addRollingStock', function (req, res) {
    var weight = req.body.weight;
    var type = req.body.type;
    var model = req.body.model;
    var horsePower = req.body.horsePower;
})
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

//test comment #3
