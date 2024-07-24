const jwt =  require("jsonwebtoken");
require("dotenv").config;

exports.auth = (req, res, next) => {
    try{
       const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer", "");

       if(!token){
          return res.status(400).json({
              success:false,
              message: "token missing",
          })
       }

       try{
          const payload = jwt.verify(token, process.env.JWT_SECRET);
          req.userExists = payload;
       } catch(error) {
             return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
       }
       next();
    } 
    catch(error) {
        return res.status(401).json({
            success:false,
            message:'Something went wrong, while verifying the token',
        });
    }
}

exports.isStudent = (req,res,next) => {
    try{
            if(req.user.role !== "Student") {
                return res.status(401).json({
                    success:false,
                    message:'THis is a protected route for students',
                });
            }
            next();
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:'User Role is not matching',
        })
    }
}

exports.isAdmin = (req,res,next) => {
    try{
        if(req.user.role !== "Admin") {
            return res.status(401).json({
                success:false,
                message:'THis is a protected route for admin',
            });
        }
        next();
}
catch(error) {
    return res.status(500).json({
        success:false,
        message:'User Role is not matching',
    })
}
}