const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config;

exports.signup = async (req,res) =>{
    try{
        const {name, email, password, role} = req.body;
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            });
        }

        let hashedPassword ;
        try{
          hashedPassword = await bcrypt.hash(password,10)
        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:"error in hashing"
            });
        }

        const user = await User.create({
            name, email, password:hashedPassword, role
        })
        return res.status(200).json({
            success:true,
            message:"User created successfully"
        });
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"user cannot be created "
        });

    }
}

exports.login = async (req,res) =>{
    try{
        const {email, password} = req.body;
        if(email === "" || password === ""){
            return res.status(400).json({
                success:false,
                message:"fill all the credentials properly"
            })
        }

        const userExists = await User.findOne({email});
        if(!userExists){
            return res.status(400).json({
                success:false,
                message:"user not exists"
            })
        }

        const payload = {
            email:userExists.email,
            id:userExists._id,
            role:userExists.role
        }
        
        if(await bcrypt.compare(password, userExists.password)){
            
            let token = jwt.sign(payload,
                process.env.JWT_SECRET,
                {
                    expiresIn:"2h"
                }
            )

            userExists = userExists.toObject();
            userExists.token = token;
            userExists.password = undefined;

            const options = {
                expires: new Date( Date.now() + 3 * 24 * 60 * 60 *1000),
                httpOnly: true
            }

            res.cookie("cookie", token, options).status(200).json({
                success:true,
                token,
                userExists,
                message:"user Logged in successfully"
            })
        } else{
            return res.status(403).json({
                success:false,
                message:"Password Incorrect",
            });
        }

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login Failure',
        });
    }
}