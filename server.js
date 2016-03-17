/**
 * Created by MrSingh on 3/11/16.
 */

'use strict';

var express = require('express'),
    app = express(),
    config = require('./config')[process.env.NODE_ENV || 'development'];

app.use(express.static(__dirname + '/app'));

// This route enables HTML5Mode by forwarding missing files to the index.html
app.all('/*', function(req, res) {
    res.sendFile(__dirname + '/app/index.html');
});

app.listen(config.port, function (err) {
    if(err){
        console.log(err);
    }else{
        console.log('Listening on port '+ config.port);
    }
});