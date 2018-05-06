class UsersDb{
    constructor(){
        this.users = [];
    }

    findUserIndex(username){
        return this.users.findIndex((user)=>{
            return username === user.username;
        })
    }
    isUserExists(username){
        let i = this.findUserIndex(username);
        if(i !== -1){
            return true
        }
        return false;
    }
    deleteUser(username){
        let i = this.findUserIndex(username);
        if(i !== -1){
            this.users.splice(i, 1);
            return true;
        }
        return false;
    }
    addUser(user){
        this.users.push(user);
    }
    getUserNamesList(){
        return this.users.map((user)=>{
            return user.username
        })
    }
    getUser(userName){
        return this.users.find((user)=>{
            return user.username === userName;
        })
    }
}

module.exports.UsersDb = UsersDb;