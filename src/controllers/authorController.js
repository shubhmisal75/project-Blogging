const authorModel = require('../models/authorModel')
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")

//------------------------1st-CREATE AUTHOR-------------------------------



const createAuthor = async function (req, res) {

    try {
        const reqbody = req.body;
        let author = await authorModel.create(reqbody);
        res.status(201).send({ msg: "The author is created", author });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ msg: "There is some error due to wrong credentials in body " })
    }

}





//---------------------------------------------------------------------------//


const login = async function (req, res) {
    try {
        let useremail = req.body.email
        let userpassword = req.body.password
        if (useremail && userpassword) {
            let User = await authorModel.findOne({ email: useremail, password: userpassword, isDeleted: false })

            if (User) {
                const Token = jwt.sign({ userId: User._id }, "Thunders")
                res.header('x-api-key', Token)
         
                res.status(200).send({ status: true, msg:"you are LoggedIn !" })
            } else {
                res.status(400).send({ status: false, Msg: "Invalid Credentials" })
            }
        } else {
            res.status(400).send({ status: false, msg: "Body must contain  email and password" })
        }
    }
    catch (err) {
        res.status(500).send({ status:false,message: err.message})
    }
}




module.exports.login = login
module.exports.createAuthor = createAuthor;