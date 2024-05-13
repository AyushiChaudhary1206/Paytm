const express=require("express");
const mainrouter=require("./routes/index")
const app=express();
const cors=require("cors");
const port=process.env.PORT||3000
app.use(cors());
app.use(express.json());


app.use("/api/v1",mainrouter)

app.listen(`{PORT}`)
