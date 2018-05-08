const {Group} = require('../models/group');
const {User} = require('../models/user');
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

    createNewGroup(){
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
                        this.filterOptions(nodes).then((selectedGroup)=>{
                            if(!selectedGroup.isNodeExistInGroup(groupName)){
                                this.tree.add(new Group(null, groupName), selectedGroup);
                                MenuView.sendMessage("Group created successfully");
                            }
                            else{
                                MenuView.sendMessage("There is already a group with this name within the group you selected")
                            }
                            this.groupsMenu();
                        });
                        // const resultsPath = nodes.map((node)=>{
                        //     return node.myPath().join(">");
                        // });
                        // for(let i = 0; i<resultsPath.length; i++){
                        //     MenuView.sendMessage(`[${i}] ${resultsPath[i]}`);
                        // }
                        // MenuView.RootMenu((i)=>{
                        //     const selectedGroup = nodes[i];

                        // }, "Select a group");
                    }
                    else if(nodes.length === 1){
                        const selectedGroup = nodes[0];
                        if(!selectedGroup.isNodeExistInGroup(groupName)){
                            this.tree.add(new Group(null, groupName), selectedGroup);
                            MenuView.sendMessage("Group created successfully");
                        }
                        else{
                            MenuView.sendMessage("There is already a group with this name within the group you selected")
                        }
                    }
                    else{
                        MenuView.sendMessage("No group with this name exists");
                    }
                }
                this.groupsMenu();
            }, "Where to? group [enter the group name] or Tree [root]?");
        }

    }

    getGroupFullPath(){
        MenuView.RootMenu((name)=>{
            const nodes = this.tree.search(name);
            if(nodes.length){
                const path = [];
                nodes.forEach((node)=>{
                    path.push(node.myPath().join(' > '));
                });
                for(let p of path){
                    MenuView.sendMessage(p);
                }
            }
            else{
                MenuView.sendMessage("Group does not exist");
            }
           this.groupsMenu();
        }, "Enter a group name");
    }

    filterOptions(nodes) {
        return new Promise((resolve,reject)=>{
            let selectedGroup;

            const resultsPath = nodes.map((node) => {
                return node.myPath().join(">");
            });
            for (let i = 0; i < resultsPath.length; i++) {
                MenuView.sendMessage(`[${i}] ${resultsPath[i]}`);
            }
            MenuView.RootMenu((i) => {
                selectedGroup = nodes[i];
                resolve (selectedGroup)
            }, "Select a group");//fixme - השאלה נשלחת פעמיים
        })
    }

    deleteGroup(){
        MenuView.RootMenu((name)=>{
            const nodes = this.tree.search(name);
            if(nodes.length > 1){
                 this.filterOptions(nodes).then((selectedGroup)=>{
                     if(selectedGroup.children.length){
                         if(selectedGroup.children[0] instanceof User){
                             selectedGroup.children.forEach((child)=>{child.removeParent(selectedGroup)});
                         }
                     }
                     if(this.tree.removeGroup(selectedGroup)){
                         MenuView.sendMessage("Group deleted successfully");
                     }
                     else{
                         MenuView.sendMessage("Something went wrong...");
                     }
                     this.groupsMenu();
                 });
            }

            else if(nodes.length === 1){
                selectedGroup = nodes[0];
                if(selectedGroup.children.length){
                    if(selectedGroup.children[0] instanceof User){
                        selectedGroup.children.forEach(user => user.removeParent(selectedGroup));
                    }
                }
                if(this.tree.removeGroup(selectedGroup)){
                    MenuView.sendMessage("Group deleted successfully");
                }
                else{
                    MenuView.sendMessage("Something went wrong, try again");
                }
                this.groupsMenu();
            }
            else{
                MenuView.sendMessage("Group does not exist");
                this.groupsMenu();
            }
        }, "Enter the name of the group you want to delete")
    }

    printGroupsList(){
        const groups = this.tree.getGroupsList();
        if(groups.length){
            for(let group of groups){
                MenuView.sendMessage(group.name);
            }
        }
        else{
            MenuView.sendMessage("The list is empty");
        }
        this.groupsMenu();
    }
}

module.exports.GroupsController = GroupsController;