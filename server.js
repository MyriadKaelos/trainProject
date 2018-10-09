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
// a “get” at the root of our web app: http://localhost:3000/
router.get('/', function(req, res) {
    res.render('index.ejs', {error: ""});
});
// all of our routes will be prefixed with /api
app.use('/', router);

function RollingStock(w,t,m,h = 0,c = [],i = getnextid()){
    this.weight = w;
    this.id = i;
    this.type = t;
    this.contents = c;
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

function Train(i = getnextid(), g = [], c = [], o = [], d = []){
    this.id = i;
    this.engines = g;
    this.cars = c;
    this.origin = o;
    this.destination = d;
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

function Company(n, i=getnextid(), f=[], t=[]){
    this.name = n;
    this.id = i;
    this.fleet = f;
    this.trains = t;
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
//return array from database
function getData(database) {
    db.collection(database).find({}).toArray((err, result) => {if(err) {console.log(err) } else {return result}})
}
function getRollingStock(obj) {
    return new RollingStock(obj.weight,obj.type,obj.makemodel,obj.horsepower,obj.contents,obj.id);
}

//ADD ROLLINGSTOCK ACTION
app.post('/addRollingStock', function (req, res) {
    var weight = req.body.weight;
    var type = req.body.type;
    var model = req.body.model;
    var horsePower = req.body.horsePower;
    db.collection('rollingStock').insertOne(new RollingStock(weight,type,model,horsePower));
    res.redirect('/');
})
// START THE SERVER
//==========================================================


var db
MongoClient.connect('mongodb://yateslough:Tra1nP@ds123003.mlab.com:23003/trainproject', {useNewUrlParser:true}, (err, client) => {
    if(err) { console.log(err) }
    console.log("Connected successfully to server");
    db = client.db('trainproject')
    app.listen(3000, () => {
        console.log('get');
    })
})

//test comment #3
