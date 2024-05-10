const express=require("express");
const mainrouter=require("./routes/index")
const app=express();
const cors=require("cors");
app.use(
    cors({
        origin:"*",
        methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"]
    })
);
app.use(express.json());


app.use("/api/v1",mainrouter)

app.listen(3000)
