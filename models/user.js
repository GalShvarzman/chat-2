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
            this.parents.splice(i, 1);
            return true
        }
        else{
            return false;
        }
    }

    updateAge(newAge){
        this.age = newAge;
        return true;
    }
    updatePassword(newPassword){
        this.password = newPassword;
        return true;
    }

    getParentsToPrint(){
        return this.parents.map((parent)=>{
            return parent.name;
        })
    }
}

module.exports.User = User;