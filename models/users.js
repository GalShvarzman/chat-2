class UsersDb{
    constructor(){
        this.users = [];
    }

    findUserIndex(username){
        return this.users.findIndex((user)=>{
            return username === user.name;
        })
    }
    isUserExists(username){
        let i = this.findUserIndex(username);
        return (i !== -1);
    }
    deleteUser(username){
        let i = this.findUserIndex(username);
        if(i !== -1){
            this.users.splice(i, 1);
            return true;
        }
        else{
            return false;
        }
    }
    addUser(user){
        this.users.push(user);
    }
    getUserNamesList(){
        return this.users.map((user)=>{
            return user.name
        })
    }
    getUser(userName){
        return this.users.find((user)=>{
            return user.name === userName;
        })
    }
}

module.exports.UsersDb = UsersDb;