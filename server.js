//at top of file
const MongoClient = require('mongodb').MongoClient;
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
    res.render('index.ejs', {error: "",companies: getData('company','company'), trains: getData('train','train')});
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
    this.calculateDistance = function(){
        if(origin[1] && destination [1]){
            //from https://github.com/r-e-stern/baseball.amtrak/blob/master/amtrak-baseball.js
            var R = 6371e3;
            var φ1 = this.origin[0]*Math.PI/180;
            var φ2 = this.destination[1]*Math.PI/180;
            var Δφ = (this.destination[0]-this.origin[0])*Math.PI/180;
            var Δλ = (this.destination[1]-this.origin[1])*Math.PI/180;
            var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
            //output in meters
        }
    }
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
    return Math.random()*1e16;
}

//return array from database
function getData(database,toObj = false) {
    db.collection(database).find().toArray((err, result) => {if(err) {console.log(err) } else {
        if(toObj) {
            if(toObj == "rollingStock") {
                let rollingStock = result.map((obj) => {
                    return getRollingStock(obj);
                })
                return rollingStock
            } else if(toObj = "train") {
                let train = result.map((obj) => {
                    return getTrain(obj);
                })
                return train
            } else {
                let company = result.map((obj) => {
                    return getCompany(obj);
                })
                return company
            }
        } else {
            return result
        }
    }})
}
//turns a mongodb rolling stock into our rollinstock object
function getRollingStock(dbStock) {
    return new RollingStock(dbStock.weight,dbStock.type,dbStock.makemodel,dbStock.horsepower,dbStock.contents,dbStock.id);
}
function getTrain(dbStock) {
    return new Train(dbStock.id,dbStock.engine,dbStock.cars,dbStock.origin,dbStock.destination);
}
function getCompany(dbStock) {
    return new Company(dbStock.name,dbStock.id,dbStock.fleet,dbStock.trains);
}


//ADD ROLLINGSTOCK ACTION
app.post('/addRollingStock', function (req, res) {
    var weight = req.body.weight;
    var type = req.body.type;
    var model = req.body.model;
    var horsePower = req.body.horsePower;
    db.collection('rollingStock').insertOne(new RollingStock(weight,type,model,horsePower));
    res.redirect('/');
});
app.post('/addCompany', function (req, res) {
    var name = req.body.name;
    db.collection('company').insertOne(new Company(name));
    res.redirect('/');
});
app.post('/addTrain', function (req, res) {
    db.collection('train').insertOne(new Train());
    res.redirect('/');
});
app.post('/addTrainToCompany', function (req, res) {
    var train = req.body.train;
    var company = req.body.company;
    db.collection('company').findOneAndUpdate({id: company},{$push : {"trains": train}})
});
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
