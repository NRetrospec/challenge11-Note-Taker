const router=require("express").Router();
const noteRoutes=require("./notes");

//http://localhost:3001/api/notes

router.use("/notes",noteRoutes);




module.exports=router;