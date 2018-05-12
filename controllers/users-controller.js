const {User} = require('../models/user');
const MenuView = require('../views/menu-view');
const mainQuestion = `== Users ==
[1] Create new User
[2] Delete user
[3] Print users List
[4] Update user age
[5] Update user password
[6] Get all groups that a user associated with
[7] Back`;

class UsersController{
    constructor(back, usersDb){
        this.back = back;
        this.usersDb = usersDb;
    }

    usersMenu(){
        MenuView.RootMenu((answer)=> {
            switch (answer) {
                case "1":
                    this.createNewUser();
                    break;
                case "2":
                    this.deleteUser();
                    break;
                case "3":
                    this.printUsersList();
                    break;
                case "4":
                    this.updateUserAge();
                    break;
                case "5":
                    this.updateUserPassword();
                    break;
                case "6":
                    this.GetAllGroupsThatAUserAssociatedWith();
                    break;
                case "7":
                    this.back();
                    break;
                default:
                    MenuView.sendMessage({message:'We did not understand your request', status:"failure"});
                    this.usersMenu();
                    break;
            }
        }, mainQuestion)
    }

    createNewUser(){
        let username, age, password;
        MenuView.RootMenu((name) => {
            if (this.usersDb.isUserExists(name)) {
                MenuView.sendMessage({message:`There is already a user called ${name}. enter a different username`, status:"failure"});
                this.createNewUser();
            }
            else{
                username = name;
                getUserAge.call(this);
            }
        }, "Enter a username");
        function getUserAge(){
            MenuView.RootMenu((userAge)=>{
                age = userAge;
                getUserPassword.call(this);
            }, "What is your age?")
        }
        function getUserPassword(){
            MenuView.RootMenu((userPassword)=>{
                password = userPassword;
                this.usersDb.addUser(new User(username, age, password));
                MenuView.sendMessage({message:`User ${username} created successfully!`, status:"success"});
                this.usersMenu();
            }, "Select a password")
        }
    }

    removeUserFromGroups(username) {
        const indexes = [];
        const parents = this.usersDb.getUser(username).parents;
        parents.forEach((parent) => {
            let i = parent.children.findIndex((child) => {
                return child.name === username;
            });
            if (i !== -1) {
                parent.children.splice(i, 1);
                indexes.push(i);
            }
        });
        return (indexes.length === parents.length);
    }

    deleteUser(){
        MenuView.RootMenu((name)=>{
            if(this.usersDb.isUserExists(name)){
                if(this.usersDb.deleteUser(name) && this.removeUserFromGroups(name)){
                    MenuView.sendMessage({message:`User ${name} deleted successfully`, status:"success"});
                    this.usersMenu();
                }
                else{
                    MenuView.sendMessage({message:"Something went wrong with the user's deletion process", status:"failure", code:3})
                }
            }
            else{
                MenuView.sendMessage({message:`User ${name} does not exist`, status:"failure"});
                this.usersMenu();
            }
        }, "Enter the name of the user you want to delete");
    }

    printUsersList(){
        const users = this.usersDb.getUserNamesList();
        if(users.length){
            for(let user of users){
                MenuView.sendMessage({message:user, status:"success"});
            }
        }
        else{
            MenuView.sendMessage({message:"The list is empty", status:"success"});
        }
        this.usersMenu();
    }

    updateUserAge(){
        let selectedUser;
        MenuView.RootMenu((name)=>{
            if(this.usersDb.isUserExists(name)){
                selectedUser = this.usersDb.getUser(name);
                getNewAgeAndUpdate.call(this);
            }
            else{
               MenuView.sendMessage({message:`User ${name} does not exist`, status:"failure"});
               this.usersMenu();
            }
        }, "Enter the name of the user you want to update");
        function getNewAgeAndUpdate(){
            MenuView.RootMenu((newAge)=>{
                if(selectedUser.updateAge(newAge)){
                    MenuView.sendMessage({message:`User ${name} age updated successfully`, status:"success"});
                    this.usersMenu();
                }
            }, "Enter the user new age")
        }
    }

    updateUserPassword(){
        let selectedUser;
        MenuView.RootMenu((name)=>{
            if(this.usersDb.isUserExists(name)){
                selectedUser = this.usersDb.getUser(name);
                getNewPasswordAndUpdate.call(this);
            }
            else{
                MenuView.sendMessage({message:`User ${name} does not exist`, status:"failure"});
                this.usersMenu();
            }
        }, "Enter the name of the user you want to update");
        function getNewPasswordAndUpdate(){
            MenuView.RootMenu((newPassword)=>{
                if(selectedUser.updatePassword(newPassword)){
                    MenuView.sendMessage({message:`User ${name} password updated successfully`, status:"success"});
                    this.usersMenu();
                }
            }, "Enter The user new Password");
        }
    }

    GetAllGroupsThatAUserAssociatedWith(){
        MenuView.RootMenu((userName)=>{
            if(this.usersDb.isUserExists(userName)){
                const selectedUser = this.usersDb.getUser(userName);
                const userParents = selectedUser.getParentsToPrint();
                if(userParents.length){
                    userParents.forEach((parent)=>{
                        MenuView.sendMessage({message:parent, status:"success"});
                    })
                }
                else{
                    MenuView.sendMessage({message:`User ${userName} is not associated with any group`, status:"failure"})
                }
            }
            else{
                MenuView.sendMessage({message:`User ${userName} does not exist`, status:"failure"});
            }
            this.usersMenu();
        }, "Enter the name of the user")
    }
}

module.exports.UsersController = UsersController;