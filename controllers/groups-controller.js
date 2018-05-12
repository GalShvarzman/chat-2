const {Group} = require('../models/group');
const {User} = require('../models/user');
const MenuView = require('../views/menu-view');
const {filterOptions} = require('../utils/filter-options');
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
                    MenuView.sendMessage({message: 'We did not understand your request', status: "failure"});
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
                MenuView.sendMessage({message:`Group ${groupName} created successfully`, status: "success"});
                this.groupsMenu();
            }
        }, "Enter a name for the group");
        function parent(){
            MenuView.RootMenu((name)=>{
                if(name === "root"){
                    if(this.tree.isNodeExistInGroup(groupName)){
                        MenuView.sendMessage({message:`There is already a group called ${groupName} within the group you selected`, status: "failure"})
                    }
                    else{
                        this.tree.add(new Group(null, groupName));
                        MenuView.sendMessage({message:`Group ${groupName} created successfully`, status: "success"});
                    }
                    this.groupsMenu()
                }
                else{
                    const nodes = this.tree.search(name);
                    if(nodes.length > 1){
                        filterOptions(nodes).then((selectedGroup)=>{
                            this.createGroup(selectedGroup, groupName);
                        })
                        .catch((err)=>{
                            MenuView.sendMessage({message: err, status: "failure"});
                            this.groupsMenu();
                        })
                    }
                    else if(nodes.length === 1){
                        const selectedGroup = nodes[0];
                        this.createGroup(selectedGroup, groupName);
                    }
                    else{
                        MenuView.sendMessage({message:`Group ${name} does not exist`, status:"failure"});
                        this.groupsMenu()
                    }
                }
            }, "Where to? group [enter the group name] or Tree [root]?");
        }

    }

    createGroup(selectedGroup, groupName){
        if(!selectedGroup.isNodeExistInGroup(groupName)){
            this.tree.add(new Group(null, groupName), selectedGroup);
            MenuView.sendMessage({message:`Group ${groupName} created successfully`, status:"success"});
        }
        else{
            MenuView.sendMessage({message:`There is already a group called ${groupName} within group ${selectedGroup.name}`, status:"failure"});
        }
        this.groupsMenu();
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
                    MenuView.sendMessage({message: p, status:"success"});
                }
            }
            else{
                MenuView.sendMessage({message:`Group ${name} does not exist`, status:"failure"});
            }
           this.groupsMenu();
        }, "Enter a group name");
    }

    deleteGroup(){
        MenuView.RootMenu((name)=>{
            const nodes = this.tree.search(name);
            if(nodes.length > 1){
                 filterOptions(nodes).then((selectedGroup)=>{
                     this.detachPointers(selectedGroup);
                 })
                 .catch((err)=>{
                     MenuView.sendMessage({message: err, status: "failure"});
                     this.groupsMenu();
                 })
            }

            else if(nodes.length === 1){
                const selectedGroup = nodes[0];
                this.detachPointers(selectedGroup);
            }

            else{
                MenuView.sendMessage({message:`Group ${name} does not exist`, status:"failure"});
                this.groupsMenu();
            }
        }, "Enter the name of the group you want to delete")
    }

    detachPointers(selectedGroup){
        if(selectedGroup.children.length){
            if(selectedGroup.children[0] instanceof User){
                selectedGroup.children.forEach(child => child.removeParent(selectedGroup));
            }
            else{
                this.detachChildrenPointers(selectedGroup);
            }
        }
        this.removeGroup(selectedGroup);
    }

    detachChildrenPointers(selectedGroup){
        const childrenParents = selectedGroup.getChildrenParentToDetach();
        childrenParents.forEach((child)=>{
            child.user.removeParent(child.parent);
        })
    }

    removeGroup(selectedGroup){
        if(this.tree.removeGroup(selectedGroup)){
            MenuView.sendMessage({message:`Group ${selectedGroup.name} deleted successfully`, status: "success"});
        }
        else{
            MenuView.sendMessage({message : "Something went wrong in the process of deleting the group", status : "failure", code:1});
        }
        this.groupsMenu();
    }

    printGroupsList(){
        const groups = this.tree.getGroupsList();
        if(groups.length){
            for(let group of groups){
                MenuView.sendMessage({message: group.name, status: "success"});
            }
        }
        else{
            MenuView.sendMessage({message:"The list is empty", status:"success"});
        }
        this.groupsMenu();
    }
}

module.exports.GroupsController = GroupsController;