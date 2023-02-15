const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = {
    createUser : async (req, res) => {
        try {
            let {phone, email, password} = req.body
            let uniqueData = await userModel.find({ $and: [{ $or: [{ phone: phone }, { email: email }] }, { isDeleted: false }] })
            let arr = []
            uniqueData.map((i) => { arr.push(i.phone, i.email) })

            if (arr.includes(phone)) {
                return res.status(409).send({ status: false, msg: "phone is already exsit" })
            }
            if (arr.includes(email)) {
                return res.status(409).send({ status: false, msg: "email is already exsit" })
            }

            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(password, salt);
            req.body.password = encryptedPassword

            let saveData = await userModel.create(req.body)
            return res.status(201).send({ status: true, msg: "Data created successfully", Data: saveData })
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    },

    login : async (req, res) => {
        try {
            let { email, password } = req.body
            let findUser = await userModel.findOne({ email: email, isDeleted: false});

            if (!findUser) {
                return res.status(404).send({ status: false, message: "User not found" });
            }

        //***********  comparing hashed password and login password ****************

            const isPasswordMatching = await bcrypt.compare(password, findUser.password);
            if (!isPasswordMatching) {
                return res.status(404).send({ status: false, message: "Either emailId or password is incorrect" })
            }
            let token = jwt.sign({ userId: findUser._id }, "Secret-key")        
            res.setHeader("token", token)
            return res.status(200).send({ Message: "LoggedIn successfully", Token: token })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    fetchUser : async (req, res) => {
        try {
            let {page} = req.params
            if (!page) {
                page = 1
            }
            let findUser = await userModel.find({isDeleted: false}).select({title: 1, name: 1, phone: 1, _id: 0}).skip(2*(page-1)).limit(2)
            return res.status(200).send({status: true, Data: findUser})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    fetchUserBySearch : async (req, res) => {
        try {
            let search = ''
            if (req.query.search) {
                search = req.query.search
            }
            let findUser = await userModel.find({name: {$regex: '.*'+search+'.*', $options: 'i' },isDeleted: false}).select({title: 1, name: 1, phone: 1, _id: 0})
            if (!findUser[0]) {
                return res.status(404).send({ status: false, msg: "User not found" })
            }
            return res.status(200).send({status: true, Data: findUser})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    fetchUserById : async (req, res) => {
        try {
            let {userId} = req.params
            let findUser = await userModel.findOne({_id: userId, isDeleted: false}).select({title: 1, name: 1, phone: 1, email: 1, _id: 0})
            if (!findUser) {
                return res.status(404).send({ status: false, msg: "User not found" })
            }
            return res.status(200).send({status: true, Data: findUser})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    updateUser : async (req, res) => {
        try {
            let {userId} = req.params
            let data = req.body
            let {phone, email, password} = data
            if (Object.keys(data).length < 1) {
                return res.status(400).send({ status: false, message: "Please enter data whatever you want to update" })
            }
            let uniqueData = await userModel.find({ $and: [{ $or: [{ phone: phone }, { email: email }] }, { isDeleted: false }] })
            let arr = []
            uniqueData.map((i) => { arr.push(i.phone, i.email) })
    
            if (arr.includes(phone)) {
                return res.status(409).send({ status: false, msg: "phone is already exsit" })
            }
            if (arr.includes(email)) {
                return res.status(409).send({ status: false, msg: "email is already exsit" })
            }

            if (password) {
                let salt = await bcrypt.genSalt(10);
                let encryptedPassword = await bcrypt.hash(password, salt);
                req.body.password = encryptedPassword
            }
            data['updatedAt'] = new Date().toLocaleString()
            let updateData = await userModel.findOneAndUpdate({_id: userId, isDeleted: false},data,{new: true})
            if (!updateData) {
                return res.status(404).send({ status: false, msg: "User not found" })
            }
            return res.status(400).send({ status: false, Data: updateData })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    deleteUser : async (req, res) => {
        try {
            let userId = req.params.userId
            let deleteData = await userModel.findOneAndUpdate({_id: userId, isDeleted: false},{isDeleted: true, deletedAt: new Date().toLocaleString()})
            if (!deleteData) {
                return res.status(404).send({ status: false, msg: "User not found" })
            }
            return res.status(400).send({ status: false, msg: 'User deleted successfully'})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    }
}