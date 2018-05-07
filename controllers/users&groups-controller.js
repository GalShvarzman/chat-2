const {Group} = require('../models/group');
const MenuView = require('../views/menu-view');
const mainQuestion = `== Users & Groups ==
[1] Add user to group
[2] Delete user from group
[3] Print a list of groups and users under each group
[4] Print full tree of group and users 
[5] Flatten group
[6] Back`
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
                    //Delete user from group
                    break;
                case "3":
                    //Print a list of groups and users under each group
                    break;
                case "4":
                    this.printFullTree();
                    break;
                case "5":
                    this.getGroupToFlatten();
                    break;
                case "6":
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
                    selectedGroup.flattening();
                })
            }
            else if(nodes.length === 1){
                selectedGroup = nodes[0];
                if(selectedGroup.flattening()){
                 MenuView.sendMessage("Group flattened successfully");
                }
                else{
                    MenuView.sendMessage("Group cannot be flattened")
                }
            }
            else{
                MenuView.sendMessage("Group does not exist");
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

    getNumberOfChildren(node){
        return 14;//fixme
    }

    printFullTree(){
        const tree = this.tree.printFullTree();
        tree.forEach((node)=>{
            let padding = this.padding(node.step);
            let childrenNumber = this.getNumberOfChildren();
            if(node.child instanceof Group){
                MenuView.sendMessage(padding + node.child.name + `(${childrenNumber})`)
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
            selectedGroup.addUserToGroup(userName, this.usersDb);
            MenuView.sendMessage("User added successfully to the group");
            this.usersAndGroupsMenu();
        }
    }

    deleteUserFromGroup(userName, selectedGroup){

    }
}

module.exports.UsersAndGroupsController = UsersAndGroupsController;