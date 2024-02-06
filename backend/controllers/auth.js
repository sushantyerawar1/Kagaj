// const { model } = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");



const JWT_SECRET = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"


const sendVerifyMail = async (firstName, lastName, emailId, id) => {
    try {
        const link = `http://localhost:3000/verify/${id}`;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sendermail169@gmail.com',
                pass: 'djlhryfqbkxezfgh'
            }
        });

        var mailOptions = {
            from: 'sendermail169@gmail.com',
            to: emailId,
            subject: 'For Verification Mail',
            text: link
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email has been send: ' + info.response);
            }
        });
    } catch (error) {
        return res.status(400).json({ msg: "Unable to Send Mail" });
    }
}

exports.verifyMail = async (req, res) => {
    const { id } = req.body;

    const user = await User.findOne({ _id: id });
    if (!user) {
        return res.status(400).json({ msg: "User Not Found" });
    }

    try {
        const UpdateInfo = await User.updateOne({
            _id: id,
        }, {
            $set: {
                isverified: true
            }
        })

        return res.status(201).json({ msg: "Account Verified Successfully", Info: UpdateInfo });
    } catch (error) {
        return res.status(400).json({ msg: "Unable to Verify Mail" });
    }
};

exports.verifyMailbyadmin = async (req, res) => {
    const { id } = req.body;

    const user = await User.findOne({ _id: id });
    if (!user) {
        return res.status(400).json({ msg: "User Not Found" });
    }

    try {
        const UpdateInfo = await User.updateOne({
            _id: id,
        }, {
            $set: {
                isVerifiedByAdmin: true
            }
        })

        return res.status(201).json({ msg: "Account Verified by admin Successfully ", Info: UpdateInfo });
    } catch (error) {
        return res.status(400).json({ msg: "Unable to Verify Mail" });
    }
};

exports.signup = async (req, res) => {
    const { firstName, lastName, state, city, emailId, password, isAdmin, profilePicture, isverified, isVerifiedByAdmin } = req.body;


    if (!firstName || !lastName || !emailId || !password || !state || !city) {
        return res.status(400).json({ msg: "Please Enter all the Fields" });
    }

    const userExists = await User.findOne({ emailId });

    if (userExists) {
        return res.status(400).json({ msg: "User already exist" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        firstName,
        lastName,
        state,
        city,
        emailId,
        hashPassword,
        isAdmin,
        profilePicture,
        isverified,
        isVerifiedByAdmin
    });

    if (user) {
        sendVerifyMail(firstName, lastName, emailId, user._id);
        return res.status(201).json({
            msg: "Mail Send Successfully"
        });
        // return res.status(201).json({
        //     msg: "User Created Successfully",
        //     User: {
        //         _id: user._id,
        //         firstName: user.firstName,
        //         lastName: user.lastName,
        //         state: user.state,
        //         city: user.city,
        //         emailId: user.emailId,
        //         isAdmin: user.isAdmin,
        //         pic: user.profilePicture,
        //         isverified: user.isverified
        //     }
        // });
    } else {
        return res.status(400).send("User not found");
    }
};


exports.login = async (req, res) => {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
        return res.status(400).json({ msg: "Please Enter all the Fields" });
    }

    const user = await User.findOne({ emailId });

    if (user && user.isverified && user.isVerifiedByAdmin) {
        const isValid = await bcrypt.compare(password, user.hashPassword)
        if (isValid) {
            return res.status(201).json({
                msg: "You Loggedin Successfully",
                User: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    emailId: user.emailId,
                    isAdmin: user.isAdmin,
                    state: user.state,
                    city: user.city,
                    pic: user.profilePicture,
                    isverified: user.isverified
                }
            });
        }
        else {
            return res.status(400).json({ msg: "Invalid mail or password" });
        }

    } else if (user.isverified == false) {
        return res.status(200).json({ msg: "Please Verify Mail" });
    } else if (user.isVerifiedByAdmin == false) {
        return res.status(200).json({ msg: "Your account is not approved by admin" });
    }
    else {
        return res.status(400).json({ msg: "User Not Found" });
    }
};


exports.forgotpassword = async (req, res) => {
    const { emailId } = req.body;

    if (!emailId) {
        return res.status(400).json({ msg: "Please Enter all the Fields" });
    }
    try {
        const user = await User.findOne({ emailId });

        if (user) {

            const secret = JWT_SECRET + user.hashPassword;
            const token = jwt.sign({ email: user.emailId, id: user._id }, secret, {
                expiresIn: "5m"
            })
            const link = `http://localhost:3000/reset-password/${user._id}/${token}`;
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'sendermail169@gmail.com',
                    pass: 'djlhryfqbkxezfgh'
                }
            });

            var mailOptions = {
                from: 'youremail@gmail.com',
                to: emailId,
                subject: 'Password Reset',
                text: link
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            return res.status(201).json({ msg: "Email Has Send!!" });

        } else {
            return res.status(400).json({ msg: "User Not Exists!!" });
        }
    } catch (error) {

    }

};

exports.resetpassword = async (req, res) => {
    const { id, token } = req.params;
    const user = await User.findOne({ _id: id });
    if (!user) {
        return res.status(400).json({ msg: "User Not Found" });
    }

    const secret = JWT_SECRET + user.hashPassword;
    try {
        const verify = jwt.verify(token, secret);
        res.render("resetpassword", { email: verify.email, status: "Not Verified" })
    } catch (error) {
        return res.status(400).json({ msg: "Not Verified" });
    }
};

exports.resetpassworddone = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ _id: id });
    if (!user) {
        return res.status(400).json({ msg: "User Not Found" });
    }

    const secret = JWT_SECRET + user.hashPassword;
    try {
        const verify = jwt.verify(token, secret);
        const hashPassword = await bcrypt.hash(password, 10);

        await User.updateOne({
            _id: id,
        }, {
            $set: {
                hashPassword: hashPassword
            }
        })
        return res.status(201).json({ msg: "Password is Successfully Updated" });
    } catch (error) {
        return res.status(400).json({ msg: "Unable to Update password" });
    }
};


