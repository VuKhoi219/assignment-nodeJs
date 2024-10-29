const { User , Role } = require("../models/user");

module.exports = {
    findbyName: async (name) => {
        return await User.findOne({ name: name , status : 0 });
    },
    createUser : async (user) => {
        let newUser = new User(user);
        return await newUser.save();
    },
    updateUser : async (id,user) => {
        return await User.updateOne({ _id: id }, user);
    },
    deleteUser : async (id) => {
        return await User.updateOne({ _id: id },{status :-1});
    },
    findbyId : async (id) => {
        return await User.findOne({ _id: id });
    },
    findByRoleName : async (name) => {
        const role = await Role.findOne({ name: name },{_id : 1});
        return role;
    },
    findByRoleId : async (id) => {
        const role = await Role.findById(id, { name: 1, _id: 0 });
        return role;
    }
}   