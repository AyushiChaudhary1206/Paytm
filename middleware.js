const {JWT_SECRET}=require('./config')
const jwt=require("jsonwebtoken");

const authmiddleware=(req,res,next)=>{
const authheader=req.headers.authorization;
// if(!authheader||!(authheader.startWith("Bearer"))){
// res.status(411).json({
//     msg:'error',
// })
// }
const token=authheader.split(" ")[1];


try{
    const decoded=jwt.verify(token,JWT_SECRET);
   req.userid=decoded.userid;
   next();
}
catch{
res.status(411).json({
    msg:"error here"
})
}


}

module.exports={
    authmiddleware
}