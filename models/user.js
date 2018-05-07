class User{
    constructor(username, age, password){
        this.name = username;
        this.age = age;
        this.password = password;
        this.parents = [];
    }
}

module.exports.User = User;