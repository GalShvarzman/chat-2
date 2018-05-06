const {User} = require('../models/user');
const {Group} = require('../models/group');
const {UsersDb} = require('../models/users');
const MenuView = require('../views/menu-view');
const mainQuestion = `== Users & Groups ==
[1] Add user to group
[2] Delete user from group
[3] Print a list of groups and users under each group
[4] Print full tree of group and users 
[5] Back`
;
class UsersAndGroupsController {
    constructor(tree, back, usersDb) {
        this.tree = tree;
        this.back = back;
        this.usersDb = usersDb;
    }

    usersAndGroupsMenu() {
        MenuView.RootMenu((answer) => {
            switch (answer) {
                case "1":
                    //Add user to group
                    this.getUsernameAndGroupName("add");
                    break;
                case "2":
                    //Delete user from group
                    break;
                case "3":
                    //Print a list of groups and users under each group
                    break;
                case "4":
                    // Print full tree of group and users.
                    // Each group sums up the users count in that
                    // group or all groups beneath it.
                    break;
                case "5":
                    this.back();
                    break;
                default:
                    MenuView.sendMessage('We did not understand your request');
                    this.usersAndGroupsMenu();
                    break;
            }
        }, mainQuestion)
    }

    getUsernameAndGroupName(action) {
        let username, groupName;
        MenuView.RootMenu((name)=>{
            if(this.usersDb.isUserExists(name)){
                username = name;
                getGroupName.call(this);
            }
            else{
                MenuView.sendMessage("User does not exist");
                this.usersAndGroupsMenu();
            }
        }, "Enter a username");

        function getGroupName(){
            MenuView.RootMenu((name)=>{
                //לעבור על כל העץ, למצוא את כל הקבוצות שעונות על השם הנ"ל
                //להראות ללקוח את הנתיבים של שתי הקבוצות ולשאול אותו לאיזה קבוצה הוא רוצה להוסיף את המשתמש
                const nodes = this.tree.search(name);
                debugger;
                if(nodes.length > 1){
                    const resultsPath = nodes.map((node)=>{
                        return node.myPath().join(">");
                    });
                    for(let i = 0; i<resultsPath.length; i++){
                        MenuView.sendMessage(`[${i}] + ${resultsPath[i]}`);
                        //לשאול את הלקוח איזה קבוצה הוא בוחר... הוא בוחר אינדקס ואז ללכת למערך של הנוודס באינדקס שהוא נתן לי ולהוסיף את היוזר.
                    }
                    // לשאול את הלקוח לאיזה קבוצה הוא רוצה להוסיף\למחוק ממנה את המשתמש?
                    MenuView.RootMenu(()=>{}, "q");
                    groupName = name;
                    if(action === "add") {
                        //addUserToGroup(username, groupName);
                    }
                    else if(action === "delete"){
                        //deleteUserFromGroup(username, groupName);
                    }
                }
                else if(results.length = 1){
                    //להמשיך הלאה עם הקבוצה היחידה.
                }
                else if(!results.length){
                    sendMessage("Group does not exist");
                    this.usersAndGroupsMenu();
                }
            }, "Enter a group name");
        }
    }
}

module.exports.UsersAndGroupsController = UsersAndGroupsController;