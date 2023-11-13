const express = require("express")
const router = express.Router()

const {createUser, login, fetchUser, fetchUserBySearch, fetchUserById, fetchUserByFilter, updateUser, deleteUser, showUniqueTeam, createTeam, getTeam} = require('../controllers/userController')
const {authentication, authorization} = require('../middlewares/auth')

router.post('/createUser', createUser)
router.post('/login', login)
router.get('/fetchUser', authentication, fetchUser)
router.get('/fetchUserBySearch', authentication, fetchUserBySearch)
router.get('/fetchUserById/:userId', authentication, fetchUserById)
router.get('/fetchUserByFilter', authentication, fetchUserByFilter)
router.put('/updateUser/:userId', authentication, authorization, updateUser)
router.delete('/deleteUser/:userId', authentication, authorization, deleteUser)

router.get('/showUniqueTeam',authentication, showUniqueTeam)
router.post('/createTeam/:userId',authentication, createTeam)
router.get('/user/:userId/getTeam/:teamId', authentication, getTeam)

router.all("/*", function (req, res) { 
    return res.status(400).send({ status: false, message: "invalid http request" });
});

module.exports = router