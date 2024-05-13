const express = require("express");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const app = express();
const {User,Account}=require("../db")
const {JWT_SECRET}=require('../config');
const { authmiddleware } = require("../middleware");
const router = express.Router();

const schema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstname: zod.string(),
  lastname: zod.string(),
});


router.post("/signup", async (req, res) => {
  const body = req.body;

  const { success } = schema.safeParse(body);

  if (!success) {
    res.send("invalid inputs");
  }

  const user = await User.findOne({
    username: req.body.username,
  });
if(user){
  if (user.username) {
    res.json("e-mail already taken");
  }
}

  const dbuser = await User.create({
    username:req.body.username,
    password:req.body.password,
    firstname:req.body.firstname,
    lastname:req.body.lastname,
  });
  const userid = dbuser._id;
  await Account.create({
    userid,
    balance: 1 + Math.random() * 10000
})
  const token = jwt.sign(
     {userid} ,
    JWT_SECRET
  );
  res.json({
    msg:"user created succuessfully",
    userid:userid,
    token:token,
  })
});

const signin=zod.object({
  username:zod.string().email(),
  password:zod.string()
})

router.post('/signin',async(req,res)=>{
  const {success}=signin.safeParse(req.body);
  if(!success){
    res.status(411).json({
      msg:"incorrect inputs"
    })
  }
const user=await User.findOne({
  username:req.body.username,
  password:req.body.password
})
if(user){
  const token=jwt.sign(
    {userID:user._id}
    ,JWT_SECRET)
 

res.json({
  token:token
})
return
}
res.status(411).json({
  msg:"error logging in"
})
})


const update=zod.object({
  password:zod.string().optional(),
  firstname:zod.string().optional(),
  lastname:zod.string().optional(),
})
router.put("/",authmiddleware,async(req,res)=>{
  const {success}=update.safeParse(req.body);
  if(!success){
    res.status(411).json({
      msg:"error"
    })
  }

  await User.updateOne(
    {
    _id:req.userid
   },{
  $set:req.body
   }
   )
 
  res.json({

    msg:"user updated successfully"
  })

})


router.get("/bulk",async (req,res)=>{
  const filter=req.query.filter||"";

  const users=await User.find({
    $or:[{
      firstname:{
        "$regex":filter,
      }
    },{
      lastname:{
        "$regex":filter,
      }
    }]
  })

  res.json({
    user:users.map(user=>({
      username:user.username,
      firstname:user.firstname,
      lastname:user.lastname,
      id:user._id
    }))
  })
})
module.exports = router;
