const { User , Role } = require("../models/user");



module.exports = {
    findbyName: async (name) => {
        return await User.findOne({ name: name , status : 0 });
    },
    createUser : async (user) => {
        let newUser = new User(user);
        return await newUser.save();
    },
    updateUser : async (user) => {
        return await User.updateOne({ _id: user.id }, {name : user.name});
    },
    deleteUser : async (id) => {
        return await User.updateOne({ _id: id },{status : -1});
    },
    findbyId : async (id) => {
        return await User.findOne({ _id: id });
    },
    findByRoleName : async (name) => {
        return await Role.findOne({ name: name } , {permissions : 0});
    }
}   