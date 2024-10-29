var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const {authenticateToken , checkPermission } = require('../middleware/auth-middleware');

/* GET home page. */
router.get('/register', function(req,res, next) {
  res.render('register')
})
router.post('/register', async (req,res, next)=>{
  // res.send("test")
    await  userController.create(req,res);
});
router.get('/login', async (req, res, next) => {
  res.render('login');
});
router.post('/login', async function(req, res, next) {
   await userController.findbyName( req, res );
});

router.get('/api/v1/admin',authenticateToken,checkPermission, function(req, res, next) {
  res.send("đây là trang admin");
})
router.get('/api/v1/editor' ,authenticateToken,checkPermission, function(req, res, next) {
  res.send("đây là trang editor");
})
router.get('/api/v1/user/',authenticateToken,checkPermission, function(req, res, next) {
  res.send("đây là trang user");
})
router.put('/api/v1/admin/:id',authenticateToken,checkPermission,async function(req, res, next) {
  await userController.updateUser( req, res );
})
router.delete('/api/v1/admin/:id',authenticateToken,checkPermission, async function(req, res, next){
  await userController.deleteUser( req, res );
})
router.post('/api/v1/admin/:role',authenticateToken,checkPermission, async function(req, res, next) {
  await userController.createAdmin( req, res );
})
module.exports = router;
