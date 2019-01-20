var express = require("express"),
    app = express(),
    upload = require("express-fileupload"),
    fs = require('fs');

//listen at port 8081
app.listen(8081);

// server started message
console.log("Server started at port 8081");

app.use(upload());

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});

//create uploads directory if it doesn't exist
if(!fs.existsSync('./uploads')){
    fs.mkdirSync('./uploads');
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
                res.sendFile('html/test.html',{root:__dirname});
            }
        });
    }
});