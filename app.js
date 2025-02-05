const express=require('express');
const app=express();
const port=5500;
const path=require('path');
let bodyParser = require("body-parser");
let contactModel=require('./ContactModel');
const {MongoClient}= require('mongodb');
const mongoose = require('mongoose');

const mongooseconnect=async()=>{
    try{
        let connect=await mongoose.connect('mongodb+srv://deepthib210b:Blings110@cluster0.8sivt.mongodb.net/Contacts');
        console.log(connect);
        return connect;
    }catch(e){
       // console.log(e);
    }
    
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/Projects.html');
})

app.get('/Projects',function(req,res){
    console.log('in Projects');
    res.sendFile(__dirname+'/Projects.html');
})

app.get('/Profile',function(req,res){
    console.log('in Profile');
    res.sendFile(__dirname+'/Profile.html');
})

app.get('/Contact',function(req,res){
    console.log('in Contact');
    res.sendFile(__dirname+'/Contact.html');
})

app.post('/addMessage',async(req,res)=>{
    console.log('first name=',req.body.FName);
    console.log('Last name=',req.body.LName);
    console.log('Email=',req.body.Email);
    console.log('Messsage=',req.body.Message);

    let connect=await mongooseconnect();

    const Cmodel = new contactModel(
    {
        Fname:req.body.FName,
        Lname:req.body.LName,
        Email:req.body.Email,
        Message:req.body.Message
    });
    let result=await Cmodel.save();
    console.log('result',result);
    res.sendFile(__dirname+'/Contact.html');
})

app.listen(port,()=>{
    console.log(`Server listening at port ${port}`);
}
)