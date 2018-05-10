const MenuView = require('../views/menu-view');

function filterOptions(nodes) {
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
            if(selectedGroup){
                resolve (selectedGroup);
            }
            else{
                reject(new Error("The selected group does not exist"));
            }
        }, "Select a group");
    })
}

module.exports.filterOptions = filterOptions;