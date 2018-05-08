class User{
    constructor(username, age, password){
        this.name = username;
        this.age = age;
        this.password = password;
        this.parents = [];
    }

    removeParent(parentNode){
        let i = this.parents.findIndex((parent)=>{
                    return parent  === parentNode
                });
        if(i !== -1){
            return true
        }
        else{
            return false;
        }
    }

}

module.exports.User = User;