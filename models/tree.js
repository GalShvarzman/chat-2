const {Group} = require('./group');
class NTree{
    constructor(){
        this.root = new Group(this.root, "treeRoot");
    }

    add(node, parentName){
        this.root.add(node, parentName);
    }
    search(nodeName){
        return this.root.search(nodeName)
    }
    searchUnique(nodeName){
        return this.root.searchUnique(nodeName);
    }
    remove(nodeName){
        this.root.remove(nodeName);
    }
    flattening(nodeName){
        this.root.flattening(nodeName);
    }
}

module.exports.NTree = NTree;