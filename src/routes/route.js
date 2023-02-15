const express = require("express")
const router = express.Router()

const {createUser, login, fetchUser, fetchUserBySearch, fetchUserById, updateUser, deleteUser} = require('../controllers/userController')
const {authentication, authorization} = require('../middlewares/auth')
const {userValidation, loginValidation, updateUserValidation} = require('../middlewares/validation')

router.post('/createUser', userValidation, createUser)
router.post('/login', loginValidation, login)
router.get('/fetchUser/:page', authentication, fetchUser)
router.get('/fetchUserBySearch', authentication, fetchUserBySearch)
router.get('/fetchUserById/:userId', authentication, fetchUserById)
router.put('/updateUser/:userId', updateUserValidation, authentication, authorization, updateUser)
router.delete('/deleteUser/:userId', authentication, authorization, deleteUser)

router.all("/*", function (req, res) { 
    return res.status(400).send({ status: false, message: "invalid http request" });
});

module.exports = router