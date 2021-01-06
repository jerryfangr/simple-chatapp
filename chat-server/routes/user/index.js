var express = require('express');
var router = express.Router();
var JsonDatabase = require('../../modules/jsondb');
const Tool = require('../../tools/base');
const IMAGE = require('../assets/image');
const userDB = new JsonDatabase('user');


/**
 * * login page
 */
router.get('/login', function (req, res, next) {
  res.render("user/login");
});


/**
 * * login 
 */
router.post('/login', function (req, res, next) {
  // has login
  if (req.session.user) {
    userDB.fetchAll(true)
      .filter({id: req.session.user.id})
      .get(data => {
        res.json({
          status: 'ok',
          result: {
            describe: 'login repeat',
            user: data[0]
          },
          error: {}
        });
      })
  } else {
    req.session.user = req.session.user || {};
    // login
    userDB.fetchAll(true)
      .add({ isOnline: false}) // create data
      .get(datas => { // get data and modefied
      const data = datas[datas.length-1];
      data.avatar = IMAGE.avatar[Tool.random(0, IMAGE.avatar.length - 1)];
      data.name = 'name ' + data.id;
      req.session.user.id = data.id;
      req.session.user.isLogin = true;
  
      res.json({
        status: 'ok',
        result: {
          describe: 'login success',
          user: data,
        },
        error: {}
      });
    // error catch (only join chat's user would save)
    }).save((data) => {}, error => {
      res.json({
        status: 'fail',
        result: {},
        error: {
          code: 500,
          describe: 'json db error'
        }
      });
    }, true)
  }
});

/**
 * * logout
 */
router.get('/logout', function (req, res, next) {
  delete req.session.user;
  res.json({
    status: 'ok',
    result: { message: 'logout success' },
    error: {}
  });
});

module.exports = router;