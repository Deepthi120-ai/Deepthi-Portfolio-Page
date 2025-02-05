let mongoose=require('mongoose');


const ContactSchema = new mongoose.Schema({
    
        Fname:String,
            
        Lname:String,

        Email:String,
           
        Message:String,
})


let contactModel = mongoose.model("ContactData", ContactSchema);

module.exports= contactModel;