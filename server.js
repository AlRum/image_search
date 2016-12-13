var express = require('express')
var app = express()
var mongo = require('mongodb').MongoClient
var Bing = require('node-bing-api')({ accKey: "34fcd7ccf3644f01813408c5a866d4eb" });


//use urlshortener


function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}


app.get('/:srch(*)', function (req, res) {
  if (req.params.srch.length==0) {res.send('Please enter the search term ');}
  else if (req.params.srch=='latest') {
     mongo.connect('mongodb://localhost:27017/image', function(err, db) {
    if (err) throw err
  
  
  db.collection('search').find({}).toArray(function(err, documents) {
    if (err) throw err;
    
    else
    
    {var out={}
    documents=documents.reverse();
    for (var i=0;i<5;i++)
      out[i]={term:documents[i].term, time:documents[i].when}
    res.send(JSON.stringify(out))}//res.redirect(documents[0].URL)}//opener('http://www.google.com');}//res.send(documents)}
    db.close()
    })
  }
  

)
  } 
  else {
    var offset=req.query.offset;
    if (offset==undefined){offset=5}
    Bing.images(req.params.srch, {
    top: offset,  // Number of results (max 50)
    skip: 3   // Skip first 3 results
  }, function(error, res1, body){

    // body has more useful information besides web pages
    // (image search, related search, news, videos)
    // but for this example we are just
    // printing the first two web page results
    var out={};
    for (var i=0;i<offset;i++){
    //var out=
    out[i]={count: i,name:body.value[i].name, URL:body.value[i].contentUrl , thubnail:body.value[i].thubnailUrl}
    //JSON.stringify({name:body.value[i].name, URL:body.value[i].contentUrl , thubnail:body.value[i].thubnailUrl}))
    }
    
    res.send(JSON.stringify(out))
    
   mongo.connect('mongodb://localhost:27017/image', function(err, db) {
    if (err) throw err
  
  
   
    db.collection('search').insert({"term" : req.params.srch,"when" : getDateTime()})
    
    db.close()
  
  })
    
    
    //console.log();
    //console.log(body.webPages.value[1]);
  });
    
    //res.redirect(documents[0].URL)}//opener('http://www.google.com');}//res.send(documents)}
    //db.close()
    }})
  
  

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})

