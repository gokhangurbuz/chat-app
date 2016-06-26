/**
 * Created by gurbuz on 19.6.2016.
 */

function PostgreSqlServerInfo (host,port,database,user,password,ssl) {

    this.host=host;
    this.port=port;
    this.database=database;
    this.user=user;
    this.password=password;
    this.ssl=ssl;
}

module.exports=PostgreSqlServerInfo;