const {User} = require('../models/user');
const MenuView = require('../views/menu-view');
const mainQuestion = `== Users ==
[1] Create new User
[2] Delete user
[3] Print users List
[4] Update user age
[5] Update user password
[6] Get all groups that a user associated with
[7] Back`
;
class UsersController{
    constructor(tree , back, usersDb){
        this.tree = tree;
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
                    MenuView.sendMessage('We did not understand your request');
                    this.usersMenu();
                    break;
            }
        }, mainQuestion)
    }

    createNewUser(){
        let username, age, password;
        MenuView.RootMenu((name) => {
            if (this.usersDb.isUserExists(name)) {
                sendMessage("username already exist. enter a different username");
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
                MenuView.sendMessage("User created successfully!");
                this.usersMenu();
            }, "Select a password")
        }
    }

    deleteUser(){
        MenuView.RootMenu((name)=>{
            if(this.usersDb.isUserExists(name)){
                const parents = this.usersDb.getUser(name).parents;
                if(this.usersDb.deleteUser(name) && this.tree.removeUserFromGroups(parents, name)){
                    MenuView.sendMessage("User deleted successfully");
                    this.usersMenu();
                }
            }
            else{
                MenuView.sendMessage("User does not exist");
                this.usersMenu();
            }
        }, "Enter the name of the user you want to delete");
    }

    printUsersList(){
        const users = this.usersDb.getUserNamesList();
        if(users.length){
            for(let user of users){
                MenuView.sendMessage(user);
            }
        }
        else{
            MenuView.sendMessage("List is empty");
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
               MenuView.sendMessage("User does not exist");
               this.usersMenu();
            }
        }, "Enter the name of the user you want to update");
        function getNewAgeAndUpdate(){
            MenuView.RootMenu((newAge)=>{
                if(selectedUser.updateAge(newAge)){
                    MenuView.sendMessage("User age updated successfully");
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
                MenuView.sendMessage("User does not exist");
                this.usersMenu();
            }
        }, "Enter the name of the user you want to update");
        function getNewPasswordAndUpdate(){
            MenuView.RootMenu((newPassword)=>{
                if(selectedUser.updatePassword(newPassword)){
                    MenuView.sendMessage("User password updated successfully");
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
                        MenuView.sendMessage(parent);
                    })
                }
                else{
                    MenuView.sendMessage("The user is not associated with any group")
                }
            }
            else{
                MenuView.sendMessage("User does not exist");
            }
            this.usersMenu();
        }, "Enter the name of the user")
    }
}

module.exports.UsersController = UsersController;