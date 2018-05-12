const {Group} = require('./group');
class NTree{
    constructor(){
        this.root = new Group(this.root, "treeRoot");
    }

    add(node, parentNode){
        this.root.add(node, parentNode);
    }
    search(nodeName){
        return this.root.search(nodeName)
    }
    searchUnique(nodeName){
        return this.root.searchUnique(nodeName);
    }
    removeGroup(node){
        return this.root.removeGroup(node);
    }

    printFullTree(){
        return this.root.printFullTree();
    }
    getGroupsList(){
        return this.root.getGroupsList();
    }
    isNodeExistInGroup(name){
        return this.root.isNodeExistInGroup(name);
    }
}

module.exports.NTree = NTree;