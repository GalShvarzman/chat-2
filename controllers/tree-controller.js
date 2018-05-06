const {NTree} = require('../models/tree');
const {UsersController}= require('./users-controller');
const {GroupsController} = require('./groups-controller');
const {UsersAndGroupsController} = require('./users&groups-controller');
const {UsersDb} = require('../models/users');
const MenuView = require('../views/menu-view');
const mainQuestion = `== Main Menu ==
[1] Users
[2] Groups
[3] Users & Groups
[4] Exit`;

class TreeController{
    constructor(){
        this.tree = new NTree();
        this.usersDb = new UsersDb();
        this.usersController = new UsersController(this.tree , this.mainMenu.bind(this), this.usersDb);
        this.groupsController = new GroupsController(this.tree, this.mainMenu.bind(this));
        this.usersAndGroupsController = new UsersAndGroupsController(this.tree, this.mainMenu.bind(this), this.usersDb);
    }

    init(){
        console.log("init");
        this.mainMenu();
    }

    mainMenu(){
        MenuView.RootMenu((answer)=>{
            switch (answer) {
                case "1":
                    this.usersController.usersMenu();
                    break;
                case "2":
                    this.groupsController.groupsMenu();
                    break;
                case "3":
                    this.usersAndGroupsController.usersAndGroupsMenu();
                    break;
                case '4':
                    exitChat();
                    break;
                default:
                    MenuView.sendMessage('We did not understand your request');
                    this.mainMenu();
                    break;
            }
        }, mainQuestion);
    }
}

module.exports.TreeController = TreeController;