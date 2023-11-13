const userModel = require('../models/userModel')
const teamModel = require('../models/teamModel')
const jwt = require('jsonwebtoken')
// const fs = require('fs')
// const path = require('path')

module.exports = {
    createUser : async (req, res) => {
        try {
            const {email} = req.body
            const findUniqueEmail = await userModel.findOne({email : email})
            // const filePath = path.join(__dirname, 'data.json');
            // const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            // Insert the JSON data into MongoDB
            // let x = await userModel.insertMany(jsonData);
        
            res.send('Data inserted successfully');
            if (findUniqueEmail) {
                return res.status(400).send({ status: true, msg: "One user is availble with this email  .. so please try different email" })
            }
            let saveData = await userModel.create(req.body)
            return res.status(201).send({ status: true, msg: "Data created successfully", Data: saveData })
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    },

    login : async (req, res) => {
        try {
            let { email } = req.body
            let findUser = await userModel.findOne({email});
            if (!findUser) {
                return res.status(404).send({ status: false, message: "User not found" });
            }
            let token = jwt.sign({ email: findUser.email }, "Secret-key")        
            res.setHeader("token", token)
            return res.status(200).send({ Message: "LoggedIn successfully", Token: token })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    fetchUserById : async (req, res) => {
        try {
            let findUser = await userModel.findOne({id: req.params.userId}).select({_id: 0})
            if (!findUser) {
                return res.status(404).send({ status: false, msg: "User not found" })
            }
            return res.status(200).send({status: true, Data: findUser})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    fetchUser : async (req, res) => {
        try {
            let {page} = req.query
            if (!page) {
                page = 1
            }
            let findUser = await userModel.find().select({_id: 0}).skip(2*(page-1)).limit(20)
            return res.status(200).send({status: true, Data: findUser})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    fetchUserBySearch : async (req, res) => {
        try {
            let search = ''
            if (req.query.name) {
                search = req.query.name
            }
            let findUser = await userModel.find({ $or: [
                { first_name: { $regex: search, $options: 'i' } }, // 'i' for case-insensitive
                { last_name: { $regex: search, $options: 'i' } }
            ]}).select({_id: 0, __v :0})
            if (!findUser[0]) {
                return res.status(404).send({ status: false, msg: "User not found" })
            }
            return res.status(200).send({status: true, Data: findUser})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    fetchUserByFilter : async (req, res) => {
        try {
            let query = {}
            let {domain, available, gender} = req.query
            if (domain) {
                query.domain = domain
            }
            if (available) {
                query.available = available
            }
            if (gender) {
                query.gender = gender
            }
            let findUser = await userModel.find(query)
            if (!findUser) {
                return res.status(404).send({ status: false, msg: 'User not found'})
            }
            return res.status(200).send({ status: true, User: findUser})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    updateUser : async (req, res) => {
        try {
            let {userId} = req.params
            let data = req.body
            if (Object.keys(data).length < 1) {
                return res.status(400).send({ status: false, message: "Please enter data whatever you want to update" })
            }
            data['updatedAt'] = new Date().toLocaleString()
            let updateData = await userModel.findByIdAndUpdate(userId, data, {new: true})
            if (!updateData) {
                return res.status(404).send({ status: false, msg: "User not found" })
            }
            return res.status(200).send({ status: true, Data: updateData })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    deleteUser : async (req, res) => {
        try {
            let deleteData = await userModel.findByIdAndDelete(req.params.userId)
            if (!deleteData) {
                return res.status(404).send({ status: false, msg: "User not found" })
            }
            return res.status(204).send({ status: true, msg: 'User deleted successfully'})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    showUniqueTeam : async (req, res) => {
        try {
            const users = await userModel.find({ available: true })
            .sort('domain') // Assuming 'domain' is the field to be sorted by
            .select('id first_name last_name email domain available'); // Select the needed fields

            const team = [];
            let prevDomain = null;
    
            users.forEach(user => {
                if (user.domain !== prevDomain) {
                    team.push(user);
                    prevDomain = user.domain;
                }
            });
            for (let i = team.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [team[i], team[j]] = [team[j], team[i]];
            }
    
            // Limit the response to, let's say, 10 random unique users
            const randomUsers = team.slice(0, 10);
            return res.status(200).send({ status: true, Team: randomUsers})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    createTeam : async (req, res) => {
        try {
            const teamData = {
                userId: req.params.userId,
                team: req.body.team
            };
            const team = await teamModel.create(teamData)
            return res.status(200).send({ status: true, msg: 'Team created successfully', Team: team})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    getTeam : async (req, res) => {
        try {
            let {userId, teamId} = req.params
            const team = await teamModel.findOne({userId: userId, _id: teamId})
            return res.status(200).send({ status: true, msg: 'Team created successfully', Team: team})
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },
}


