/**
 * Created by gurbuz on 25.6.2016.
 */
var pub = require('redis-connection')('');
var sub = require('redis-connection')('subscriber');

var commonFunc=require('./../controllers/common');
var chatHistory=require('./../controllers/chatHistory');
var moment=require('moment');

function chatHandler (socket) {

    socket.on('io:username', function (name) {

        pub.HSET("users", socket.client.conn.id, name);

        pub.HGETALL("users",function (err,result) {

            if(!err){
                pub.publish("users:connected",JSON.stringify(result));
            }
        });

        console.log(socket.client.conn.id + " > " + name + ' joined chat!');

        pub.publish("users:new", name);
    });

    socket.on('io:message', function (msg) {

        msg = commonFunc.sanitizeText(msg);

        pub.HGET("users", socket.client.conn.id, function (err, name) {

            var str=null;

            if(name!=null){
                str = JSON.stringify({
                    name: name,
                    message: msg,
                    datetime: moment().format()
                });
                chatHistory.save(str);
            }
            
            pub.publish("users:least", str);  // latest message
        })
    });

    socket.on("disconnect", function () {

        console.log("disconnect " + socket.client.conn.id);

        if(socket){
            pub.HDEL("users",socket.client.conn.id,function (err) {
                if(!err){
                    pub.HGETALL("users",function (err,result) {
                        if(!err){
                           console.log(JSON.stringify(result));
                            pub.publish("users:connected",JSON.stringify(result));
                        }
                    });
                }
            });
        }
    });

    socket.on('error', function (err) { console.error(err.stack) })
}


function init (io, callback) {

    pub.on("ready", function () {

        sub.on("ready", function () {

            sub.subscribe("users:least", "users:new","users:connected");

            io.on('connection', chatHandler);

            sub.on("message", function (channel, message) {
                console.log(channel + " : " + message);
                io.emit(channel, message);
            });

            setTimeout(function(){ callback() }, 300);
        });
    });
}

module.exports = {
    init: init,
    pub: pub,
    sub: sub
};
