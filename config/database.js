const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.URL)
   .then(()=>{
        console.log("Connected to DB")
    })
   .catch((error) =>{
       console.log("Cannot connect to db")
       console.log(error)
       process.exit(1)
   })
}