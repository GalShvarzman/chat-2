const {User} = require('./user');
let i = 0;
class Group {
    constructor(parent, name, children) {
        this.parent = parent;
        this.name = name;
        this.children = children || [];
    }

    removeParent(node){
        return;
    }


    flattening() {
        let parent = this.parent;
        if(parent.children.length === 1) {
            parent.children.length = 0;
            if(this.children){
                this.children.forEach((child)=>{
                    parent.children.push(child);
                    child.removeParent(this);
                    child.parents.push(parent);
                });
                return true
            }

        }
        else{
            return false
        }

    }

    printFullTree(){
        return [{"child":this, "step":0, "count":""} , ...this.walkTree(this, 1, 0)]
    }

    walkTree(node, step, count){//fixme count.....
        const allTree = [];
        if(node.children){
            node.children.forEach((child)=>{
                if(child.children){
                    allTree.push({child, step, count :count+(child.children.length)})
                }
                else{
                    allTree.push({child, step});
                }
                if(child.children){
                    allTree.push(...this.walkTree(child, step+1, count));
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

    removeUserFromGroups(parents, userName) {
        const indexes = [];
        parents.forEach((parent) => {
            let i = parent.children.findIndex((child) => {
                return child.name === userName;
            });
            if (i !== -1) {
                parent.children.splice(i, 1);
                indexes.push(i);
            }
        });
        if (indexes.length === parents.length) {
            return true;
        }
        else {
            return false;
        }
    }

    checkTypeAndAdd(resultNode, node) {
        if (resultNode.children.length) {
            if (resultNode.children[0] instanceof Group && node instanceof Group) {
                resultNode.children.push(node);
                node.parent = resultNode;
                return true;
            }
            else if (resultNode.children[0] instanceof User && node instanceof User) {
                resultNode.children.push(node);
                node.parents.push(resultNode);
                return true;
            }
            else if (resultNode.children[0] instanceof Group && node instanceof User) {
                if (resultNode.others) {// fixme cant add the same user to others;
                    if(resultNode.others.isNodeExistInGroup(node.name)){
                        return false;
                    }
                    else{
                        resultNode.others.children.push(node);
                    }
                }
                else {
                    resultNode.others = new Group(resultNode, "others" + ++i, [node]);
                    resultNode.children.push(resultNode.others);
                }
                node.parents.push(resultNode.others);
                return true;
            }
            else {
                const otherChildren = resultNode.children.map((child) => {
                    return child;
                });
                resultNode.children = [];
                resultNode.others = new Group(resultNode, "others" + ++i, otherChildren);
                resultNode.children.push(resultNode.others);
                otherChildren.forEach((child) => {
                    child.parents.push({
                        parent: resultNode,
                        name: "others" + i,
                        children: otherChildren
                    })
                });
                resultNode.children.push(node);
                node.parent = resultNode;
                return true;
            }
        }
        else {
            resultNode.children.push(node);
            if (node instanceof Group) {
                node.parent = resultNode;
            }
            else {
                node.parents.push(resultNode);
            }
            return true;
        }
    }

    // searchGroupPath(groupName) {
    //     const groupNode = this.searchUnique(groupName);
    //     const path = groupNode.myPath(groupNode);
    //     return path.map((step) => {
    //         return step
    //     })
    // }

    add(node, parentNode) {
        if (parentNode) {
            this.checkTypeAndAdd(parentNode, node);
        }
        else {
            this.checkTypeAndAdd(this, node);
        }
    }

    addUserToGroup(userName, usersDb) {
        const userNode = usersDb.getUser(userName);
        if(!this.checkTypeAndAdd(this, userNode)){
            return false
        }
        else{
            return true
        }
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
        if (i !== -1) {
            return true;
        }
        else {
            return false;
        }
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