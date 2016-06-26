/**
 * Created by gurbuz on 18.6.2016.
 */
var postgreSqlServerInfo=require('./model/PostgreSqlServerInfo');

process.env.NODE_ENV='production';

var config={

    initRedisServerInfo: function () {

        switch (process.env.NODE_ENV) {
            case 'production':
            case 'development':
                process.env.REDISCLOUD_URL = 'redis://h:p7msu77r663ceo8fjnv7r62rtgp@ec2-23-23-126-210.compute-1.amazonaws.com:10509';
                break;

            //TODO:Other environment variables will be added.
        }
    },
    getPostgreSqlServerInfo:function () {
        var host='';
        var port='';
        var database='';
        var user='';
        var password='';
        var ssl=true;


        switch (process.env.NODE_ENV)
        {
            case 'production':
            case 'development':
                host= 'ec2-54-225-195-254.compute-1.amazonaws.com';
                port= 5432;
                database= 'd3jc2hchiif8in';
                user= 'ouningwemyxhot';
                password= 'Hfpd7UgZrqkUJ-GXxLy4YluxC3';
                ssl=true;
                break;

            //TODO:Other environment variables will be added.
        }

        return new postgreSqlServerInfo(host,port,database,user,password,ssl);
    }
};

module.exports=config;