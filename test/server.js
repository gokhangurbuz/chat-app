/**
 * Created by gurbuz on 26.6.2016.
 */
var application = require('../app');
var supertest = require('supertest');
var should =require('should');

describe('GetMessageHistory', function () {
    it('GET/ load returns previous messages', function (done) {
        supertest(application)
            .get('/api/getMessageHistory?startIndex=1466683087.632&endIndex=1466942287.632')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
                if (err) done(err);
                else{
                    res.status.should.equal(200);
                    done();
                }
            });
    });
});