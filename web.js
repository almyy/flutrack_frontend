/**
 * Created by martalm on 18.02.2016.
 */
var express = require('express');
var request = require('request');
var app = express();

app.use('/', express.static(__dirname + '/app'));
app.get('/api', function(req, res) {
    var flutrackUrl = 'http://api.flutrack.org/results.json';
    request(flutrackUrl).pipe(res);
});
app.get('/api/prediction', function(req, res) {
    var flutrackUrl = 'http://flutrack-backend.herokuapp.com/prediction';
    request(flutrackUrl).pipe(res);
});
app.get('/test/prediction', function(req, res) {
    var flutrackUrl = 'http://127.0.0.1:8000/prediction';
    request(flutrackUrl).pipe(res);
});
app.listen(process.env.PORT || 5000, function(){
    console.log("Server started. Running on port " + (process.env.PORT ? process.env.PORT : 5000));
});

