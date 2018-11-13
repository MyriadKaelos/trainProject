const MongoClient = require('mongodb').MongoClient;
var express       = require('express');
var bodyParser    = require('body-parser');
var app           = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs');
var router = express.Router();
router.get('/', function(req, res) {
    db.collection('company').find().toArray((err, result) => {
        db.collection('train').find().toArray((err, result1) => {
            db.collection('rollingStock').find().toArray((err2, result2) => {
                res.render('index.ejs', {error: "", company: result.map((company, index, companies) => {
                    return new Company(company.name, company.id, company.fleet, company.trains);
                }), train: result1.map((train, index, trains) => {
                    return new Train(train.id,train.engines,train.cars,train.origin,train.destination);
                }), rollingStock: result2.map((rollingStock, index, rollingStocks) => {
                    return new RollingStock(rollingStock.weight, rollingStock.type, rollingStock.makemodel, rollingStock.horsepower,
                        rollingStock.contents, rollingStock.id);
                })});
            })
        })
    })
});
app.use('/', router);

function RollingStock(w,t,m,h = 0,c = [],i = getnextid()){
    this.weight = w;
    this.id = i;
    this.type = t;
    this.contents = c;
    this.makemodel = m;
    this.horsepower = h;
    this.formal = function(){
        if(this.horsepower!=0){return this.horsepower+"-hp "+this.makemodel+" engine"}
        else{return this.weight + "-pound "+this.makemodel+" "+this.type+" car"}
    };
    this.addContent = function(c,w){
        if(typeof c == "number" && typeof w == "string" && w.length>=0){
            console.log(c + w + this.id);
            this.contents.push([c,w]);
            this.weight+=c;
        }
    }
}
function Train(i = getnextid(), g = [], c = [], o = [], d = [], w = 0, h = 0){
    this.id = i;
    this.engines = g;
    this.cars = c;
    this.origin = o;
    this.destination = d;
    this.formal = function(){
        if(this.destination[1]){
            return (this.cars.length+this.engines.length) + "-car train to "+this.destination[2];
        }else{
            return "idle "+(this.cars.length+this.engines.length) + "-car train";
        }

    };
    this.addEngine = function(e){
        if(typeof e == "number" && !this.engines.includes(e)){
            this.engines.push(e);
        }
    };
    this.addCar = function(c){
        if(typeof c == "number" && !this.engines.includes(c)){
            this.cars.push(c);
        }
    };
    this.setOrigin = function(lat,long,n){
        this.origin = [lat,long,n];
    };
    this.setDestination = function(lat,long,n){
        this.destination = [lat,long,n];
    };
    this.calculateDistance = function(){
        if(this.origin[1] && this.destination [1]){
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
        } else {
            return 0
        }
    };
    this.weight = function(){
        var w = 0;
        for(l of [this.engines,this.cars]){
            for(var i=0; i<l.length; i++){
                w += l[i].weight;
            }
        }
        return w;
    };
    this.horsepower = function(){
        var h = 0;
        for(l of this.engines){
            h += l.horsepower;
        }
        return h;
    };
    this.speed = function(){
        return 375 * this.horsepower() / this.weight();
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
    return Date.now()+Math.random();
}

app.post('/addRollingStock', function (req, res) {
    var weight = parseInt(req.body.weight);
    var type = req.body.type;
    var model = req.body.model;
    var horsePower = parseInt(req.body.horsePower);
    console.log("new rollingstock, weight: " + weight + ", type: " + type + ", model: " + model + ", horsepower: " + horsePower + ".")
    db.collection('rollingStock').insertOne(new RollingStock(weight,type,model,horsePower));
    res.redirect('/');
});
app.post('/addCompany', function (req, res) {
    console.log("add company with name: " + req.body.name);
    var name = req.body.name;
    db.collection('company').insertOne(new Company(name));
    res.redirect('/');
});
app.post('/addTrain', function (req, res) {
    console.log("new train");
    db.collection('train').insertOne(new Train());
    res.redirect('/');
});
app.post('/addTrainToCompany', function (req, res) {
    var dk = parseFloat(req.body.company)
    db.collection("company").find({id: dk}).toArray((err,result) => {
        if(err) {console.log(err)} else {
            let newCompany = new Company(result[0].name, result[0].id, result[0].fleet, result[0].trains);
            newCompany.addTrain(parseFloat(req.body.train));
            db.collection("company").findOneAndReplace({id: result[0].id}, newCompany);
            res.redirect("/");
        }
    });
});
app.post('/addRollingStocktoTrain', function (req, res) {
    var dk = parseFloat(req.body.train)
    db.collection("train").find({id: dk}).toArray((err,result) => {
        if(err) {console.log(err)} else {
            console.log(result);
            let newTrain = new Train(result[0].id,result[0].engines,result[0].cars,result[0].origin,result[0].destination);
            db.collection("rollingStock").find({id: parseFloat(req.body.rollingStock)}).toArray((err1,res1) => {
                if(err1){console.log(err1)} else{
                    let newRS = new RollingStock(res1[0].weight,res1[0].type,res1[0].makemodel,res1[0].horsepower,res1[0].contents,res1[0].id);
                    if(newRS.type == "engine"){
                        newTrain.addEngine(newRS.id);
                    }else{
                        newTrain.addCar(newRS.id);
                    }
                    console.log(newTrain);
                    db.collection("train").findOneAndReplace({id: result[0].id}, newTrain);
                    res.redirect("/");
                }
            });
        }
    });
});
app.post('/addRollingStocktoCompany',function(req,res){
    var rollingStock = parseFloat(req.body.rollingStock)
    var company = parseFloat(req.body.company)
    db.collection('company').find({id: company}).toArray((err,result) => {
        let newCompany = new Company(result[0].name,result[0].id,result[0].fleet,result[0].trains);
        newCompany.addToFleet(rollingStock);
        db.collection("company").findOneAndReplace({id: result[0].id}, newCompany);
        res.redirect('/');
    })
});
app.post('/fillRollingStock',function(req,res){
    var rollingStock = parseFloat(req.body.rollingStock)
    var contentName = req.body.contentName
    var contentNumber = parseInt(req.body.contentNumber)
    db.collection('rollingStock').find({id: rollingStock}).toArray((err,result) => {
        if(err) {console.log(err)} else {
            console.log(" Rolling Stock with ID: " + rollingStock);
            console.log(result);
            let newRollingStock = new RollingStock(result[0].weight,result[0].type,result[0].makemodel,result[0].horsepower,result[0].contents,result[0].id)
            console.log(typeof contentName + " " + contentName);
            console.log(typeof contentNumber + " " + contentNumber);
            newRollingStock.addContent(contentNumber,contentName);
            console.log(newRollingStock.contents);
            console.log(" Fill Rolling Stock with ID: " + rollingStock);
            db.collection('rollingStock').findOneAndReplace({id: result[0].id}, newRollingStock)
            res.redirect('/');
        }
    })
});
app.post('/setTrainRoute',function(req,res){
    var train = parseFloat(req.body.train);
    var origin = [req.body.originLat,req.body.originLong,req.body.originName]
    var destination = [req.body.destinationLat,req.body.destinationLong,req.body.destinationName]
    db.collection("train").find({id: train}).toArray((err,result) => {
        if(err) {console.log(err)} else {
            let newTrain = new Train(result[0].id,result[0].engines,result[0].cars,result[0].origin,result[0].destination);
            newTrain.setOrigin(origin[0],origin[1],origin[2]);
            newTrain.setDestination(destination[0],destination[1],destination[2]);
            db.collection("train").findOneAndReplace({id: result[0].id}, newTrain);
            res.redirect('/');
        }
    })
});

MongoClient.connect('mongodb://yateslough:Tra1nP@ds123003.mlab.com:23003/trainproject', {useNewUrlParser:true}, (err, client) => {
    if(err) { console.log(err) }
    console.log("Connected successfully to server");
    db = client.db('trainproject')
    app.listen(process.env.PORT || 5000,function(){
        console.log("listening on 5000");
    });
})
