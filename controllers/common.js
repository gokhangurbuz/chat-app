/**
 * Created by gurbuz on 25.6.2016.
 */
var commonFunc={

    sanitizeText: function (value) {

        if(value.indexOf("<") > -1
            || value.indexOf(">") > -1) {
            value = value.replace(/</g, "&lt").replace(/>/g, "&gt");
        }
        return value;
    },
    getTime: function (timestamp) {
    var t, h, m, s;
    t = new Date(timestamp);
    h = this.leadZero(t.getHours());
    m = this.leadZero(t.getMinutes());
    s = this.leadZero(t.getSeconds());
    return '' + h  + ':' + m + ':' + s;
    },
    leadZero:function (number) {
        return (number < 10) ? '0'+number : number;
    }
};

module.exports=commonFunc;