const {Group} = require('../models/group');
const {filterOptions} = require('../utils/filter-options');
const MenuView = require('../views/menu-view');
const mainQuestion = `== Users & Groups ==
[1] Add user to group
[2] Delete user from group
[3] Print full tree of group and users 
[4] Flatten group
[5] Back`;

class UsersAndGroupsController {
    constructor(tree, back, usersDb) {
        this.tree = tree;
        this.back = back;
        this.usersDb = usersDb;
    }

    usersAndGroupsMenu() {
        MenuView.RootMenu((answer) => {
            switch (answer) {
                case "1":
                    this.getUsernameAndGroupName("add");
                    break;
                case "2":
                    this.getUsernameAndGroupName("delete");
                    break;
                case "3":
                    this.printFullTree();
                    break;
                case "4":
                    this.getGroupToFlatten();
                    break;
                case "5":
                    this.back();
                    break;
                default:
                    MenuView.sendMessage({message:'We did not understand your request', status: "failure"});
                    this.usersAndGroupsMenu();
                    break;
            }
        }, mainQuestion)
    }

    getGroupToFlatten(){
        MenuView.RootMenu((groupName)=>{
            const nodes = this.tree.search(groupName);
            if(nodes.length > 1) {
                filterOptions(nodes).then((selectedGroup)=>{
                    this.flattenGroup(selectedGroup);
                })
                .catch((err)=>{
                    MenuView.sendMessage({message:err, status:"failure"});
                    this.usersAndGroupsMenu();
                });
            }
            else if(nodes.length === 1){
                const selectedGroup = nodes[0];
                this.flattenGroup(selectedGroup);
            }
            else{
                MenuView.sendMessage({message:`Group ${groupName} does not exist`, status:"failure"});
                this.usersAndGroupsMenu();
            }

        }, "Enter the name of the group you want to flatten");
    }

    flattenGroup(selectedGroup){
        if(selectedGroup.flattening()){
            MenuView.sendMessage({message:`Group ${selectedGroup.name} flattened successfully`, status:"success"});
        }
        else{
            MenuView.sendMessage({message:`Group ${selectedGroup.name} cannot be flattened`, status:"failure"})
        }
        this.usersAndGroupsMenu();
    }

    padding(number){
        let start = " ";
        let space =  "†";
        for(let i = 0; i<number; i++){
           start += space
        }
        return start;
    }

    printFullTree(){
        const tree = this.tree.printFullTree();
        tree.forEach((node)=>{
            let padding = this.padding(node.step);
            if(node.child instanceof Group){
                let childrenNumber = node.child.getNumberOfChildren();
                MenuView.sendMessage({message: padding + node.child.name + `(${childrenNumber})`, status:"success"});
            }
            else{
                MenuView.sendMessage({message:padding + node.child.name, status:"success"});
            }
        });
        this.usersAndGroupsMenu();
    }

    getUsernameAndGroupName(action) {
        let userName;
        MenuView.RootMenu((name)=>{
            if(this.usersDb.isUserExists(name)){
                userName = name;
                getGroupName.call(this);
            }
            else{
                MenuView.sendMessage({message:`User ${userName} does not exist`, status:"failure"});
                this.usersAndGroupsMenu();
            }
        }, "Enter a username");

        function getGroupName(){
            MenuView.RootMenu((name)=>{
                const nodes = this.tree.search(name);
                if(nodes.length > 1){
                    filterOptions(nodes).then((selectedGroup)=>{
                        this.addOrDelete(action, userName, selectedGroup);
                    }).catch((err)=>{
                        MenuView.sendMessage({message:err, status: "failure"});
                        this.usersAndGroupsMenu();
                    });
                }
                else if(nodes.length === 1){
                    const selectedGroup = nodes[0];
                    this.addOrDelete(action, userName, selectedGroup);
                }
                else{
                    MenuView.sendMessage({message:`Group ${name} does not exist`, status:"failure"});
                    this.usersAndGroupsMenu();
                }
            }, "Enter a group name");
        }
    }

    addOrDelete(action, userName, selectedGroup ){
        if(action === "add") {
            this.addUserToGroup(userName, selectedGroup);
        }
        else if(action === "delete"){
            this.deleteUserFromGroup(userName, selectedGroup);
        }
    }

    addUserToGroup(userName, selectedGroup){
        if(selectedGroup.isNodeExistInGroup(userName)){
            MenuView.sendMessage({message:`${userName} is already exist in group ${selectedGroup.name}`, status:"failure"});
        }
        else{
            const userNode = this.usersDb.getUser(userName);
            if(!selectedGroup.addUserToGroup(userNode)){
                MenuView.sendMessage({message:`${userName} can not be added to group ${selectedGroup.name}`, status:"failure"})
            }
            else{
                MenuView.sendMessage({message:`${userName} added successfully to group ${selectedGroup.name}`, status:"success"});
            }
        }
        this.usersAndGroupsMenu();
    }

    deleteUserFromGroup(userName, selectedGroup){
        if(!selectedGroup.isNodeExistInGroup(userName)){
            MenuView.sendMessage({message:`${userName} does not exist in group ${selectedGroup.name}`, status:"failure"});
        }
        else{
            const user = this.usersDb.getUser(userName);
            if(user.removeParent(selectedGroup) && selectedGroup.removeUserFromGroup(userName)){
                MenuView.sendMessage({message:`${userName} deleted successfully from group ${selectedGroup.name}`, status:"success"});
            }
            else{
                MenuView.sendMessage({message:"Something went wrong in the process of deleting the user from the group", status:"failure", code:2});
            }
        }
        this.usersAndGroupsMenu();
    }
}

module.exports.UsersAndGroupsController = UsersAndGroupsController;