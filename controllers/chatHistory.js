/**
 * Created by gurbuz on 19.6.2016.
 */
var promise = require('bluebird'); // or any other Promise/A+ compatible library;
var moment=require('moment');

var options = {
    promiseLib: promise
};

var pgp=require('pg-promise')(options);
var conf=require('./../config');

var chatHistory= {

    save: function (req) {

        var log = JSON.parse(req);
        var db = pgp(conf.getPostgreSqlServerInfo());

        db.query("INSERT INTO public.chatlogs(sendername,message,createdate) values($1,$2,$3)",
        [log.name, log.message, log.datetime])
        .catch(function (error) {
            console.log("ERROR:", error);
        }).finally(function () {
             pgp.end();
        });
},
    getByTwoDateBetween: function (req,callback) {

        var db = pgp(conf.getPostgreSqlServerInfo());

        db.query("SELECT * FROM public.chatlogs where createdate BETWEEN $1 and $2",
        [req.startdate,req.enddate])
        .then(function (data) {
            
               callback(null,data);
        })
        .catch(function (error) {
            console.log("ERROR:", error);
            callback(null,err);
        }).finally(function () {
        pgp.end();
    });
}
}

module.exports=chatHistory;