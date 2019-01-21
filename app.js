var express = require("express"),
    app = express(),
    upload = require("express-fileupload"),
    fs = require('fs'),
    os = require('os'),
    cors = require('cors');
    var _ = require('underscore');
    let bodyParser = require('body-parser');

    app.use(cors());
    app.use(function (req, res, next) {

                    // Website you wish to allow to connect
                    res.setHeader('Access-Control-Allow-Origin', '*');

                    // Request methods you wish to allow
                    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

                    // Request headers you wish to allow
                    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

                    // Set to true if you need the website to include cookies in the requests sent
                    // to the API (e.g. in case you use sessions)
                    res.setHeader('Access-Control-Allow-Credentials', true);

                    // Pass to next layer of middleware
                    next();
                
                });
    app.use(bodyParser());
/*
function allowCrossDomain(req, res, next) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  var origin = req.headers.origin;
  if (_.contains(app.get('allowed_origins'), origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
}

app.configure(function () {
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(allowCrossDomain);
});
*/
//listen at port 8081
app.listen(8081);

// server started message
console.log("Server started at port 8081");

app.use(upload());

//app.use(cors({origin:'null'}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});

//create uploads directory if it doesn't exist
if(!fs.existsSync('./uploads')){
    fs.mkdirSync('./uploads');
}

//create processed directory if it doesn't exist
if(!fs.existsSync('./processed')){
    fs.mkdirSync('./processed');
}

//handle post for test
app.get('/test',function(req,res){
    res.send("test");
});

//handle post request
app.post("/upload",function(req,res){

    if(req.files.upfile){

        var file = req.files.upfile;
        //var filename = file.name;
        file.mv("./uploads/generated.csv",function(err){

            //if error occured in uploading
            if(err){
                //print error
                res.send("Error occured.");
                console.log(err);
            }
            else{
                //else success
                //res.send("Successful");
                //res.redirect('localhost:8081/test');
                res.sendFile('html/graph.html',{root:__dirname});
                // Add headers
                /*app.use(function (req, res, next) {

                    // Website you wish to allow to connect
                    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

                    // Request methods you wish to allow
                    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

                    // Request headers you wish to allow
                    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

                    // Set to true if you need the website to include cookies in the requests sent
                    // to the API (e.g. in case you use sessions)
                    res.setHeader('Access-Control-Allow-Credentials', true);

                    // Pass to next layer of middleware
                    next();
                });*/
                /*app.use(function(req,res,next){
                    res.header("Access-Control-Allow-Origin","*");
                    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With,Content-Type, Accept");
                    next();
                })*/
                app.get('/getDataJSON',function(req,res){

                    res.header("Access-Control-Allow-Origin", "*");

                    fs.readFile("./uploads/generated.csv", 'utf8', function (err,data) {

                        if (err) {
                            return console.log(err);    //display error if any
                        }

                        var result = data.replace(/;/g, ',');   //regex to make replacement in CSV file

                        //console.log(result);

                        //writing the corrected result to the same file
                        fs.writeFile("./processed/generated.csv", result, 'utf8', function (err) {
                            if (err) return console.log(err);
                        });

                        //funny story* - this call has to be inside the readFile's body or use synchronous version of these methods
                        fs.readFile('./processed/generated.csv', 'utf8', function(err,data){
                            console.log(data);
                            if(err){
                                console.log("An error occured\n"+err);
                            }
                            var cur = [];
                            var arr = data.split(os.EOL);

                            for(var i = 1; i < 20; i++){
                                //console.log(arr[i].split(',')[1]);
                                cur[i-1] = arr[i].split(',')[1];
                                //console.log(cur[i]);
                            }
                            var json = {"times":cur};
                            //console.log(json);
                            res.send(json);
                            //console.log(arr);
                        });
                    });
                    //res.send(json);
                })
            }
        });
    }
});
