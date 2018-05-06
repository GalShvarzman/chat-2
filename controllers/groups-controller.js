const {Group} = require('../models/group');
const MenuView = require('../views/menu-view');

const mainQuestion = `==Groups==
[1] Create new group,
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
                    //Delete group
                    break;
                case "3":
                    //printGroupsList
                    break;
                case "4":
                    //Get group full path
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
                    this.tree.add(new Group(null, groupName));
                }
                else{
                    this.tree.add(new Group(null, groupName), answer);
                }
                MenuView.sendMessage("Group created successfully");
                this.groupsMenu();
            }, "Where to? group [enter the group name] or Tree [root]?")
        }

    }
    getGroupFullPath(groupName){
        return this.tree.myPath(groupName);
    }


}

module.exports.GroupsController = GroupsController;