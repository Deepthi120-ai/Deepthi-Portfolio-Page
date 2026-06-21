const express=require('express');
const app=express();
const port=5500;
const path=require('path');
let bodyParser = require("body-parser");//
let contactModel=require('./ContactModel');
const mongoose = require('mongoose');

const mongooseconnect=async()=>{
    if (!process.env.MONGODB_URI) {
        return null;
    }

    try{
        let connect=await mongoose.connect(process.env.MONGODB_URI);
        console.log(connect);
        return connect;
    }catch(e){
       console.log('MongoDB connection failed', e.message);
    }
    
}

const sendToStrapi = async (payload) => {
    const baseUrl = process.env.STRAPI_URL;
    const token = process.env.STRAPI_TOKEN;
    const endpoint = process.env.STRAPI_INQUIRY_ENDPOINT || '/api/inquiries';

    if (!baseUrl) {
        return null;
    }

    const response = await fetch(`${baseUrl.replace(/\/$/, '')}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ data: payload })
    });

    if (!response.ok) {
        const details = await response.text();
        throw new Error(`Strapi request failed with ${response.status}: ${details}`);
    }

    return response.json();
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));//Render static files like JS files and images

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
    const payload = {
        fullName: req.body.FName,
        lastName: req.body.LName || '',
        email: req.body.Email,
        projectCategory: req.body.ProjectCategory || 'General Inquiry',
        message: req.body.Message,
    };

    console.log('New inquiry=', payload.email);

    try {
        const strapiResult = await sendToStrapi(payload);

        if (strapiResult) {
            return res.redirect('/#inquire');
        }

        let connect=await mongooseconnect();

        if (!connect) {
            console.log('No STRAPI_URL or MONGODB_URI configured. Inquiry was not persisted.');
            return res.redirect('/#inquire');
        }

        const Cmodel = new contactModel(
        {
            Fname:payload.fullName,
            Lname:payload.lastName,
            Email:payload.email,
            ProjectCategory:payload.projectCategory,
            Message:payload.message,
        });
        let result=await Cmodel.save();
        console.log('result',result);
        res.redirect('/#inquire');
    } catch (e) {
        console.log('Inquiry submission failed', e.message);
        res.status(502).send('Unable to save your inquiry right now. Please email deepthi.b210@gmail.com directly.');
    }
})

app.listen(port,()=>{
    console.log(`Server listening at port ${port}`);
}
)
