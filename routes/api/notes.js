const router=require("express").Router();
const fs=require("fs");

//http://localhost:3001/api/notes/
router.get("/", (req,res)=>{

    fs.readFile("./db/db.json","utf-8", (err,data)=>{
        if(err){
           res.status(500).json(err)
        }

        const notes=JSON.parse(data)
       
        res.json(notes)

    })
})

//Post request reference week 11 mini project in routes->tips.js

module.exports=router;