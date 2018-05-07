const {Group} = require('../models/group');
const MenuView = require('../views/menu-view');

const mainQuestion = `== Groups ==
[1] Create new group
[2] Delete group
[3] Print groups list
[4] Get group full path
[5] Back`;

class GroupsController{
    constructor(tree, back){
        this.tree = tree;
        this.back = back;
    }

    groupsMenu(){
        MenuView.RootMenu((answer)=> {
            switch (answer) {
                case "1":
                    this.createNewGroup();
                    break;
                case "2":
                    this.deleteGroup();
                    break;
                case "3":
                    this.printGroupsList();
                    break;
                case "4":
                    this.getGroupFullPath();
                    break;
                case "5":
                    this.back();
                    break;
                default:
                    MenuView.sendMessage('We did not understand your request');
                    this.groupsMenu();
                    break;
            }
        }, mainQuestion)
    }

    createNewGroup(){ //fixme if a group contains group1 it cant contain another group called group1.
        let groupName;
        MenuView.RootMenu((name)=>{
            groupName = name;
            if(this.tree.root.children.length){
                parent.call(this);
            }
            else{
                this.tree.add(new Group(null, groupName));
                MenuView.sendMessage("Group created successfully");
                this.groupsMenu();
            }
        }, "Enter a name for the group");
        function parent(){
            MenuView.RootMenu((answer)=>{
                if(answer === "root"){
                    if(this.tree.isNodeExistInGroup(groupName)){
                        MenuView.sendMessage("There is already a group with this name within the group you selected")
                    }
                    else{
                        this.tree.add(new Group(null, groupName));
                        MenuView.sendMessage("Group created successfully");
                    }
                }
                else{
                    const nodes = this.tree.search(answer);
                    if(nodes.length > 1){
                        const resultsPath = nodes.map((node)=>{
                            return node.myPath().join(">");
                        });
                        for(let i = 0; i<resultsPath.length; i++){
                            MenuView.sendMessage(`[${i}] ${resultsPath[i]}`);
                        }
                        MenuView.RootMenu((i)=>{
                            const selectedGroup = nodes[i];
                            if(!selectedGroup.isNodeExistInGroup(groupName)){
                                this.tree.add(new Group(null, groupName), selectedGroup);
                                MenuView.sendMessage("Group created successfully");
                            }
                            else{
                                MenuView.sendMessage("There is already a group with this name within the group you selected\n")
                            }
                        }, "Select a group");
                    }
                    else if(nodes.length === 1){
                        const selectedGroup = nodes[0];
                        if(!selectedGroup.isNodeExistInGroup(groupName)){
                            this.tree.add(new Group(null, groupName), selectedGroup);
                            MenuView.sendMessage("Group created successfully");
                        }
                        else{
                            MenuView.sendMessage("There is already a group with this name within the group you selected\n")
                        }
                    }
                    else{
                        MenuView.sendMessage("No group with this name exists");
                    }
                }
                this.groupsMenu();
            }, "Where to? group [enter the group name] or Tree [root]?")
        }

    }
    getGroupFullPath(){
        MenuView.RootMenu((name)=>{
            const nodes = this.tree.search(name);
            const path = [];
            nodes.forEach((node)=>{
                path.push(node.myPath().join(' > '));
            });
            for(let p of path){
                MenuView.sendMessage(p);
            }
           this.groupsMenu();
        }, "Enter a group name");
    }

    deleteGroup(){
        MenuView.RootMenu((name)=>{
            const nodes = this.tree.search(name);
            if(nodes.length > 1){
                const resultsPath = nodes.map((node)=>{
                    return node.myPath().join(">");
                });
                for(let i = 0; i<resultsPath.length; i++){
                    MenuView.sendMessage(`[${i}] ${resultsPath[i]}`);
                }
                MenuView.RootMenu((i)=> {
                    const selectedGroup = nodes[i];
                    this.tree.removeGroup(selectedGroup);
                    MenuView.sendMessage("Group deleted successfully");
                    this.groupsMenu();
                }, "Select a group to delete")
            }
            else if(nodes.length === 1){
                const selectedGroup = nodes[0];
                if(this.tree.removeGroup(selectedGroup)){
                    MenuView.sendMessage("Group deleted successfully");
                    this.groupsMenu();
                }
                else{
                    MenuView.sendMessage("Something went wrong, try again");
                    this.groupsMenu();
                }
            }
            else{
                MenuView.sendMessage("Group does not exist");
                this.groupsMenu();
            }
        }, "Enter the name of the group you want to delete")
    }
    printGroupsList(){
        const groups = this.tree.getGroupsList();
        for(let group of groups){
            MenuView.sendMessage(group.name);
        }
        this.groupsMenu();
    }
}

module.exports.GroupsController = GroupsController;