// MOCK the Facebook API

var sessionFromFacebook = require('../lib/sessionFromFacebook');
sessionFromFacebook._dependencies.getMeFromFB = function(code, cb) {
    console.log('getMeFromFB stubbed');
    assert.equal(code, "stubbed-token")
    var fixtureResponse = {
        name : "Mr. Miyagi",
        id : 123456789
    };
    cb(false, fixtureResponse);
};

// stuff we need for this script

var SyncpointAPI = require('../lib/syncpoint-api'),
    coux = require('coux').coux,
    assert = require("assert"),
    docstate = require("docstate"),
    tap = require("tap"), test = tap.test, plan = tap.plan,
    e = require('errLog').e;

// tests should also be capable of testing other implementations
// eg: integration tests

var testConfig = require('./testConfig');


function smallRand() {
    return Math.random().toString().substr(2,4);
}

var handshake_db = testConfig.host + '/' + testConfig.handshake_db;
// setup the database
var server = testConfig.host;

// so nodeunit will run us
exports.awesome = function(test) {
  setTimeout(function() {
    console.log("timeout node tap for grunt");
    test.done()
  },1 * 1000);
};

var handshakeId, handshakeDoc, userControlDb;
test("should create the handshake db on the server", function(test) {
  coux.del(handshake_db, function() {
      var syncpoint = new SyncpointAPI(testConfig);
      syncpoint.start(function(err) {
          console.log("syncpoint started")
          coux(handshake_db, function(err, info) {
              console.log("handshake db info", info)
              test.expect(err).toEqual(false)
              test.expect(info.db_name).toEqual(testConfig.handshake_db)
              test.done()
          })
      });
  });
})


test("and a handshake doc", function(test) {
    console.log("testing handshake");
    var handshakeDoc = {
        oauth_creds : {
          consumer_key: smallRand(),
          consumer_secret: smallRand(),
          token_secret: smallRand(),
          token: smallRand()
        },
       "type": "session-fb",
       "fb_access_token": "stubbed-token",
       "state": "new"
    };
    coux.post(handshake_db, handshakeDoc, function(err, ok) {
        test.expect(err).toEqual(false)
        console.log("did handshake", ok);
        handshakeId = ok.id;
        test.done()
    })
})
    
    
    //     it("when the doc is active", function(test) {
    //         testHelper.waitForDoc(handshake_db, handshakeId, 1, function(err, doc) {
    //             expect(err).toEqual(false)
    //             expect(doc.state).toEqual("active")
    //             handshakeDoc = doc
    //             test.done()
    //         })
    //     })
    //     it("should update the user doc", function(test) {
    //         coux([server, testConfig.users_db, handshakeDoc.user_id], e(function(err, user) {
    //             console.log("user",user.full_name)
    //             expect(user.state).toEqual('has-control')
    //             expect(user.oauth.consumer_keys[handshakeDoc.oauth_creds.consumer_key])
    //                 .toEqual(handshakeDoc.oauth_creds.consumer_secret);
    //             expect(user.control_database).toBeDefined()
    //             userControlDb = user.control_database;
    //             test.done()
    //         }))
    //     })
    //     it("should create the control database", function(test) {
    //         coux([server, userControlDb], function(err, ok) {
    //             expect(err).toEqual(false)
    //             test.done()
    //         })
    //     })
    //     it("should install the control design doc", function(test) {
    //         coux([server, userControlDb, "_design/control"], function(err, doc) {
    //             expect(err).toEqual(false)
    //             expect(doc.views || false).not.toEqual(false)
    //             test.done()
    //         })
    //     })
    // })
    // 
