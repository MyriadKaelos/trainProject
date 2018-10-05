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
    this.formal = function(){
        if(this.horsepower!=0){return this.horsepower+"-hp engine"}
        else{return this.weight + "-pound "+this.type+" car"}
    };
    this.addContent = function(c,w){
        if(typeof c == "number" && typeof w == "string" && w>=0){
            this.contents.push([c,w]);
        }
    }
}

function Train(){
    this.id = getnextid();
    this.engines = [];
    this.cars = [];
    this.origin = [];
    this.destination = [];
    this.formal = function(){
        return (this.cars.length+this.engines.length) + "-car train to "+this.destination[2];
    };
    this.addEngine = function(e){
        if(typeof e == "number"){
            this.engines.push(e);
        }
    };
    this.addCar = function(c){
        if(typeof e == "number"){
            this.cars.push(e);
        }
    };
    this.setOrigin = function(lat,long,n){
        this.origin = [lat,long,n];
    };
    this.setDestination = function(lat,long,n){
        this.destination = [lat,long,n];
    };
}

function Company(n){
    this.name = n;
    this.id = getnextid();
    this.fleet = [];
    this.trains = [];
    this.addToFleet = function(r){
        if(typeof r == "number"){
            this.fleet.push(r);
        }
    };
    this.addTrain = function(r){
        if(typeof r == "number"){
            this.trains.push(r);
        }
    }
}

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
