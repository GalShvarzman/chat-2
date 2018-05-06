let i = 0;
class Group {
    constructor(parent, name, children) {
        this.parent = parent;
        this.name = name;
        this.children = children || [];
    }

    flattening(nodeName){
        //remove the node but add his users to his parent node;
    }
    remove(nodeName){
        //remove node from tree;
    }
    checkTypeAndAdd(resultNode, node) {
        if (resultNode.children.length) {
            if (resultNode.children[0] instanceof Group && node instanceof Group) {
                resultNode.children.push(node);
                node.parent = resultNode;
            }
            else if(resultNode.children[0] instanceof User && node instanceof User){
                resultNode.children.push(node);
                node.parents.push(resultNode);
            }
            else if (resultNode.children[0] instanceof Group && node instanceof User) {
                if(resultNode.others){
                    resultNode.others.children.push(node);
                }
                else{
                    resultNode.others = new Group(resultNode, "others" + ++i, [node]);
                    resultNode.children.push(resultNode.others);
                }
                node.parents.push(resultNode.others);
            }
            else {
                const otherChildren = resultNode.children.map((child) => {
                    return child;
                });
                resultNode.children = [];
                resultNode.others = new Group(resultNode, "others" + ++i, otherChildren);
                resultNode.children.push(resultNode.others);
                otherChildren.forEach((child) => {
                    child.parents.push ({
                        parent: resultNode,
                        name: "others" + i,
                        children: otherChildren
                    })
                });
                resultNode.children.push(node);
                node.parent = resultNode;
            }
        }
        else{
            resultNode.children.push(node);
            if(node instanceof Group){
                node.parent = resultNode;
            }
            else{
                node.parents.push(resultNode);
            }

        }
    }

    searchGroupPath(groupName){
        const groupNode = this.searchUnique(groupName);
        const path = groupNode.myPath(groupNode);
        return path.map((step)=>{
            return step
        })
    }

    add(node, parentName) {// לפני שמוסיפים קבוצה לקבוצה אחרת צריך לבדוק אם השם הזה כבר קיים שם... ואם כן לא לאפשר להוסיף..
        //בנוסף, אם נותנים שם של קבוצה שלא קיימת לזרוק שגיאה שאין קבוצה כזאת... ולחזור לתפריט.
        if (parentName) {
            const result = this.searchUnique(parentName);
            if (result) {
                this.checkTypeAndAdd(result, node);
            }
            else{
                //error///group does not exist!
            }
        }
        else {
            this.checkTypeAndAdd(this, node);
        }
    }

    search(nodeName){
        return this.internalSearchAll.call(this, this, nodeName);
    }

    internalSearchAll(node, nodeName){//fixme the searchAll needs to walk all the tree because group name is not unique;
        if(node.children){
            const results = [];
            node.children.forEach((child) => {
                if (child.name === nodeName) {
                    results.push(child);
                }
                results.push(...this.internalSearchAll(child, nodeName));
            });
            return results; // return array with all the group who have the same name;
        }
    }

    searchUnique(nodeName) {
        return this.internalSearchUnique(this, nodeName)
    }

    internalSearchUnique(node, nodeName) {
        if(node.children){
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

    myPath(){/// check אם יש לי כמה קבוצות עם אותו השם אני מכניסה את כל הנתיבים שלהן לאותו מערך.. לא טוב
        const parents = this.getParents();
        return parents.map((parent)=>{
            return parent.name;
        });
    }
    getParents(){
        const parents = [this];
        if(this.parent){
            parents.unshift(...this.parent.getParents());
        }
        return parents
    }
}

module.exports.Group = Group;