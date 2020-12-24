const fs = require('fs');
const path = require('path');
const bcryptjs= require("bcryptjs");


const file = path.join(__dirname, '../data/users.json');

function getAllUsers(){

	return JSON.parse(fs.readFileSync(file, "utf-8"));
}


function generateNewId(){
	const users = getAllUsers();
	return users.pop().id + 1;
}

function writeUsers(user) {
    const users = getAllUsers();
    const usersToSave = [...users, user];
    const userToJson = JSON.stringify(usersToSave, null, " ");
    fs.writeFileSync(file, userToJson);
}


const controller = {
    showRegister: (req, res) => {
        // Do the magic
        res.render('./user/user-register-form');
    },
    processRegister: (req, res) => {
        const image = req.files[0].filename;
        const passwordHashed= bcryptjs.hashSync(req.body.password, 5);
        const user ={
            id: generateNewId(),
            avatar: image,
            email: req.body.email,
            password: passwordHashed,
            retype: passwordHashed
        }
        writeUsers(user);
        res.redirect("/");
       
    },
    showLogin: (req, res) => {
        
        return res.render('./user/user-login-form');
    },
    processLogin: (req, res) => {
       const email= req.body.email;
       const password= req.body.password;
       const users= getAllUsers();

       const userExist= users.find((user) => {
           return user.email === email;
       });

       if(userExist && bcryptjs.compareSync(password, userExist.password)) {
        req.session.email = email; 
        return res.redirect("/user/profile");  
      }
       res.render("./user/profile", {
           loginError: true
       }); 
         
    },
    showProfile: (req, res) => {
        const user =  getAllUsers().find((user)=>{
            return user.email === req.session.email;
        });
         res.render("./user/profile", {
             email: user.email,
             
            });
    },

    logout: (req, res) => {
        res.cookie("email", null, {maxAge: -1});
        req.session.destroy();
        res.redirect('/user/login');
    },

};

module.exports = controller;