const {User} = require('./user');
let i = 0;
class Group {
    constructor(parent, name, children) {
        this.parent = parent;
        this.name = name;
        this.children = children || [];
    }

    flattening() {
        let parent = this.parent;
        if(parent.children.length === 1) {
            parent.children.length = 0;
            if(this.children){
                this.children.forEach((child)=>{
                    parent.children.push(child);
                    if(child instanceof User){
                        child.removeParent(this);
                        child.parents.push(parent);
                    }
                    else{
                      child.parent = parent; // check
                    }
                });
                return true// fixme
            }

        }
        else{
            return false
        }

    }

    getChildrenParentToDetach(){
        return this.walkAllChildrenAndGetParent(this, this.parent);
    }

    walkAllChildrenAndGetParent(node, parent){
        const childrenParent = [];
        if(node.children){
            node.children.forEach((child)=>{
                if(child instanceof User){
                    childrenParent.push({"user":child, "parent": node});
                }
                if(child.children){
                    childrenParent.push(...this.walkAllChildrenAndGetParent(child, node));
                }
            });
            return childrenParent;
        }
    }

    getNumberOfChildren(){
        return this.walkChildren(this);
    }

    walkChildren(node){
        let allChildren = 0;
        if(node.children){
            node.children.forEach((child)=>{
                if(child instanceof User){
                    allChildren += 1;
                }
                if(child.children){
                    allChildren += this.walkChildren(child);
                }
            });
            return allChildren;
        }
    }

    printFullTree(){
        return [{"child":this, "step":0} , ...this.walkTree(this, 1)]
    }

    walkTree(node, step){
        const allTree = [];
        if(node.children){
            node.children.forEach((child)=>{
                allTree.push({child, step});
                if(child.children){
                    allTree.push(...this.walkTree(child, step+1));
                }
            });
            return allTree;
        }
    }

    removeGroup(node) {
        let parent = node.parent;
        let i = parent.children.findIndex((child) => {
            return child.name === node.name;
        });
        if (i !== -1) {
            parent.children.splice(i, 1);
            return true;
        }
        else {
            return false;
        }
    }

    addNodeToSelectedGroup(parentGroup, newNode) {
        const groupChildren = parentGroup.children;
        if (groupChildren.length) {
            const groupFirstChild = groupChildren[0];
            if (groupFirstChild instanceof Group){
                return this.addNodeToSelectedGroupWhenGroupChildrenAreGroups(groupChildren, newNode, parentGroup);
            }
            else {
                return this.addNodeToSelectedGroupWhenGroupChildrenAreUsers(groupChildren, newNode, parentGroup)
            }
        }
        else {
            return this.addNodeToSelectedGroupWhenGroupHasNoChildren(groupChildren, newNode, parentGroup);
        }
    }

    addNodeToSelectedGroupWhenGroupChildrenAreGroups(groupChildren, newNode, parentGroup){
        if(newNode instanceof Group) {
            groupChildren.push(newNode);
            newNode.parent = parentGroup;
            return true;
        }
        else{
            return this.checkForOthersGroup(groupChildren, newNode, parentGroup);
        }
    }

    checkForOthersGroup(groupChildren, newNode, parentGroup){
        const groupOthers = parentGroup.others;
        if (groupOthers) {
            if(groupOthers.isNodeExistInGroup(newNode.name)){
                return false;
            }
            else{
                groupOthers.children.push(newNode);
            }
        }
        else {
            parentGroup.others = new Group(parentGroup, "others" + ++i, [newNode]);
            groupChildren.push(parentGroup.others);
        }
        newNode.parents.push(parentGroup.others);
        return true;
    }

    addNodeToSelectedGroupWhenGroupChildrenAreUsers(groupChildren, newNode, parentGroup){
        if(newNode instanceof User){
            groupChildren.push(newNode);
            newNode.parents.push(parentGroup);
        }
        else{
            parentGroup.others = new Group(parentGroup, "others" + ++i, groupChildren);
            groupChildren.length = 0;
            groupChildren.push(parentGroup.others, newNode);
            newNode.parent = parentGroup;

            parentGroup.others.children.forEach((child) => {
                child.removeParent(parentGroup);
                child.parents.push(parentGroup.others);
            });
        }
        return true;
    }

    addNodeToSelectedGroupWhenGroupHasNoChildren(groupChildren, newNode, parentGroup){
        groupChildren.push(newNode);
        if (newNode instanceof Group) {
            newNode.parent = parentGroup;
        }
        else {
            newNode.parents.push(parentGroup);
        }
        return true;
    }

    // addNodeToSelectedGroup(resultNode, node) {//fixme לסדר בפונקציות קטנות שכל אחת עושה רק דבר אחד
    //     if (resultNode.children.length) {
    //         if (resultNode.children[0] instanceof Group && node instanceof Group) {
    //             resultNode.children.push(node);
    //             node.parent = resultNode;
    //             return true;
    //         }
    //         else if (resultNode.children[0] instanceof User && node instanceof User) {
    //             resultNode.children.push(node);
    //             node.parents.push(resultNode);
    //             return true;
    //         }
    //         else if (resultNode.children[0] instanceof Group && node instanceof User) {
    //             if (resultNode.others) {
    //                 if(resultNode.others.isNodeExistInGroup(node.name)){
    //                     return false;
    //                 }
    //                 else{
    //                     resultNode.others.children.push(node);
    //                 }
    //             }
    //             else {
    //                 resultNode.others = new Group(resultNode, "others" + ++i, [node]);
    //                 resultNode.children.push(resultNode.others);
    //             }
    //             node.parents.push(resultNode.others);
    //             return true;
    //         }
    //         else {
    //             resultNode.others = new Group(resultNode, "others" + ++i, resultNode.children);
    //             resultNode.children = [];
    //             resultNode.children.push(resultNode.others);
    //             resultNode.children.push(node);
    //             node.parent = resultNode;
    //
    //             resultNode.others.children.forEach((child) => {
    //                 child.removeParent(resultNode);
    //                 child.parents.push(resultNode.others);
    //             });
    //
    //             return true;
    //         }
    //     }
    //     else {
    //         resultNode.children.push(node);
    //         if (node instanceof Group) {
    //             node.parent = resultNode;
    //         }
    //         else {
    //             node.parents.push(resultNode);
    //         }
    //         return true;
    //     }
    // }

    add(node, parentNode) {
        if (parentNode) {
            this.addNodeToSelectedGroup(parentNode, node);
        }
        else {
            this.addNodeToSelectedGroup(this, node);
        }
    }

    addUserToGroup(userNode) {
        return this.addNodeToSelectedGroup(this, userNode)
    }


    search(nodeName) {
        return this.internalSearchAll(this, nodeName);
    }

    internalSearchAll(node, nodeName) {
        if (node.children) {
            const results = [];
            node.children.forEach((child) => {
                if (child.name === nodeName) {
                    results.push(child);
                }
                if(child.children){
                    results.push(...this.internalSearchAll(child, nodeName))
                }
            });
            return results;
        }
    }

    searchUnique(nodeName) {
        return this.internalSearchUnique(this, nodeName)
    }

    internalSearchUnique(node, nodeName) {
        if (node.children) {
            let result;
            node.children.some((child) => {
                if (child.name === nodeName) {
                    result = child;
                    return true;
                }
                else {
                    result = this.internalSearchUnique(child, nodeName);
                    return result;
                }
            });
            return result;
        }
    }

    myPath() {
        const parents = this.getParents();
        return parents.map((parent) => {
            return parent.name;
        });
    }

    getParents() {
        const parents = [this];
        if (this.parent) {
            parents.unshift(...this.parent.getParents());
        }
        return parents
    }

    isNodeExistInGroup(name) {
        const i = this.children.findIndex((child) => {
            return child.name === name;
        });
        return i !== -1;
    }

    getGroupsList() {
        return this.internalSearchAllGroups(this)
    }

    internalSearchAllGroups(node) {
        if (node.children) {
            const results = [];
            node.children.forEach((child) => {
                if (child instanceof Group) {
                    results.push(child);
                }
                if(child.children){
                    results.push(...this.internalSearchAllGroups(child));
                }
            });
            return results;
        }
    }
    removeUserFromGroup(userName){
        let i = this.children.findIndex((child)=>{
                    return child.name === userName
                });
        if(i !== -1){
            this.children.splice(i ,1);
            return true;
        }
        else{
            return false;
        }
    }
}

module.exports.Group = Group;