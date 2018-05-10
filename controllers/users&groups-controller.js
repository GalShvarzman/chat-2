const {Group} = require('../models/group');
const {User} = require('../models/user');
const MenuView = require('../views/menu-view');
const mainQuestion = `== Users & Groups ==
[1] Add user to group
[2] Delete user from group
[3] Print full tree of group and users 
[4] Flatten group
[5] Back`
;
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

    deleteUserFromGroup(userName, selectedGroup){
        if(!selectedGroup.isNodeExistInGroup(userName)){
            MenuView.sendMessage("User does not exist in this group");
        }
        else{
            const user = this.usersDb.getUser(userName);
            if(user.removeParent(selectedGroup) && selectedGroup.removeUserFromGroup(userName)){
                MenuView.sendMessage("User deleted successfully from the group");
            }
            else{
                MenuView.sendMessage("Something went wrong");
            }
        }
        this.usersAndGroupsMenu();
    }

    getGroupToFlatten(){// fixme filter options
        MenuView.RootMenu((groupName)=>{
            let selectedGroup;
            const nodes = this.tree.search(groupName);
            if(nodes.length > 1) {
                const resultsPath = nodes.map((node) => {
                    return node.myPath().join(">");
                });
                for (let i = 0; i < resultsPath.length; i++) {
                    MenuView.sendMessage(`[${i}] ${resultsPath[i]}`);
                }
                MenuView.RootMenu((i) => {
                    selectedGroup = nodes[i];
                    if(selectedGroup.flattening()){
                        MenuView.sendMessage("Group flattened successfully");
                    }
                    else{
                        MenuView.sendMessage("Group cannot be flattened")
                    }
                    this.usersAndGroupsMenu();
                }, "Select a group")
            }
            else if(nodes.length === 1){
                selectedGroup = nodes[0];
                if(selectedGroup.flattening()){
                 MenuView.sendMessage("Group flattened successfully");
                }
                else{
                    MenuView.sendMessage("Group cannot be flattened")
                }
                this.usersAndGroupsMenu();
            }
            else{
                MenuView.sendMessage("Group does not exist");
                this.usersAndGroupsMenu();
            }

        }, "Enter the name of the group you want to flatten");
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
                MenuView.sendMessage(padding + node.child.name + `(${childrenNumber})`) //fixme
            }
            else{
                MenuView.sendMessage(padding + node.child.name);
            }
        });
        this.usersAndGroupsMenu();
    }

    getUsernameAndGroupName(action) {
        let userName, selectedGroup;
        MenuView.RootMenu((name)=>{
            if(this.usersDb.isUserExists(name)){
                userName = name;
                getGroupName.call(this);
            }
            else{
                MenuView.sendMessage("User does not exist");
                this.usersAndGroupsMenu();
            }
        }, "Enter a username");

        function getGroupName(){
            MenuView.RootMenu((name)=>{
                const nodes = this.tree.search(name);
                if(nodes.length > 1){
                    const resultsPath = nodes.map((node)=>{
                        return node.myPath().join(">");
                    });
                    for(let i = 0; i<resultsPath.length; i++){
                        MenuView.sendMessage(`[${i}] ${resultsPath[i]}`);
                    }
                    MenuView.RootMenu((i)=>{
                        selectedGroup = nodes[i];
                        this.addOrDelete(action, userName, selectedGroup);
                    }, "Select a group");
                }
                else if(nodes.length === 1){
                    selectedGroup = nodes[0];
                    this.addOrDelete(action, userName, selectedGroup);
                }
                else if(!nodes.length){
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
            MenuView.sendMessage("User is already exist in this group");
            this.usersAndGroupsMenu();
        }
        else{
            if(!selectedGroup.addUserToGroup(userName, this.usersDb)){
                MenuView.sendMessage("The user can not be added to the group")
            }
            else{
                MenuView.sendMessage("User added successfully to the group");
            }
            this.usersAndGroupsMenu();
        }
    }

    deleteUserFromGroup(userName, selectedGroup){
        if (selectedGroup.removeUserFromGroup(userName)){
            const selectedUser = this.usersDb.getUser(userName);
            selectedUser.removeParent(selectedGroup);
            MenuView.sendMessage("User deleted successfully");
        }
        else{
            MenuView.sendMessage("Something went wrong...");
        }
        this.usersAndGroupsMenu();
    }
}

module.exports.UsersAndGroupsController = UsersAndGroupsController;