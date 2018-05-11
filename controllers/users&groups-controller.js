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
                    MenuView.sendMessage('We did not understand your request');
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
                    this.checkIfFlattenSucceeded(selectedGroup);
                })
                .catch((err)=>{
                    MenuView.sendMessage(err);
                    this.usersAndGroupsMenu();
                });
            }
            else if(nodes.length === 1){
                const selectedGroup = nodes[0];
                this.checkIfFlattenSucceeded(selectedGroup);
            }
            else{
                MenuView.sendMessage(`Group ${groupName} does not exist`);
                this.usersAndGroupsMenu();
            }

        }, "Enter the name of the group you want to flatten");
    }

    checkIfFlattenSucceeded(selectedGroup){
        if(selectedGroup.flattening()){
            MenuView.sendMessage(`Group ${selectedGroup.name} flattened successfully`);
        }
        else{
            MenuView.sendMessage(`Group ${selectedGroup.name} cannot be flattened`)
        }
        this.usersAndGroupsMenu();
    }

    padding(number){
        let start = " ";
        let space =  "-";
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
                MenuView.sendMessage(padding + node.child.name + `(${childrenNumber})`);
            }
            else{
                MenuView.sendMessage(padding + node.child.name);
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
                MenuView.sendMessage(`${userName} does not exist`);
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
                        MenuView.sendMessage(err);
                        this.usersAndGroupsMenu();
                    });
                }
                else if(nodes.length === 1){
                    const selectedGroup = nodes[0];
                    this.addOrDelete(action, userName, selectedGroup);
                }
                else{
                    MenuView.sendMessage("Group does not exist");
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
            MenuView.sendMessage(`${userName} is already exist in group ${selectedGroup.name}`);
        }
        else{
            const userNode = this.usersDb.getUser(userName);
            if(!selectedGroup.addUserToGroup(userNode)){
                MenuView.sendMessage(`${userName} can not be added to group ${selectedGroup.name}`)
            }
            else{
                MenuView.sendMessage(`${userName} added successfully to group ${selectedGroup.name}`);
            }
        }
        this.usersAndGroupsMenu();
    }

    deleteUserFromGroup(userName, selectedGroup){
        if(!selectedGroup.isNodeExistInGroup(userName)){
            MenuView.sendMessage(`${userName} does not exist in group ${selectedGroup.name}`);
        }
        else{
            const user = this.usersDb.getUser(userName);
            if(user.removeParent(selectedGroup) && selectedGroup.removeUserFromGroup(userName)){
                MenuView.sendMessage(`${userName} deleted successfully from group ${selectedGroup.name}`);
            }
            else{
                MenuView.sendMessage("Something went wrong...");//fixme
            }
        }
        this.usersAndGroupsMenu();
    }
}

module.exports.UsersAndGroupsController = UsersAndGroupsController;