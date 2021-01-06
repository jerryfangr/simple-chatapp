var express = require('express');
var router = express.Router();
var path = require('path');
var config = require('../assets/config');


var userRouter = require('./user/index');
const getToken = require('../tools/token');

router.use((req, res, next) => {
  if (config.cross) {
    res.header("Access-Control-Allow-Origin", config.origin);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type, XFILENAME, XFILECATEGORY, XFILESIZE');
    // res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  }
  next();
});

router.get('/', function(req, res, next) {
  res.redirect('/user/login')
});


/**
 * * get token
 */
router.get('/token', function (req, res, next) {
  const token = getToken();
  res.json({
    status: 'ok',
    result: { token },
    error: {}
  })
});

/**
 * * check token
 */
// router.use((req, res, next) => {
//   const token = req.query.token || req.body.token;
//   if (token !== getToken()) {
//     res.status(403).json({
//       status: 'fail',
//       error: {
//         code: 403,
//         describe: 'bad token'
//       }
//     })
//   } else {
//     next();
//   }
// });

router.use('/user', userRouter);

module.exports = router;
