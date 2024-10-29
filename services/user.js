let userRepo = require("../repository/repo");
const jwt = require("jsonwebtoken");
const secretkey = "secretkey";

const bcrypt = require("../services/bcrypt");

module.exports = {
  createUser: async (user) => {
    if (!user) return null;
    user.password = await bcrypt.hashPassword(user.password);
    const savedUser = await userRepo.createUser(user);
    return savedUser;
  },
  findbyName: async (name, password) => {
    if (!name || !password) return;
    const result = await userRepo.findbyName(name);
    if (!result) return 404;
    const isValidPassword = await bcrypt.comparePassword(
      password,
      result.password
    );
    if (!isValidPassword) return 401;
    const token = jwt.sign(
      { name: result.name, _id: result._id, roles: result.roles },
      secretkey,
      {
        expiresIn: "1h",
      }
    );
    return { result, token };
  },
  updateUser: async (user) => {
    if (!user) return null;
    const savedUser = await userRepo.updateUser(user);
    return savedUser;
  },
  deleteUser : async (id) => {
    if (!id) return null;
    const savedUser = await userRepo.deleteUser(id);
    return savedUser;
  },
  find: async (id) => {
    if (!id) return null;
    const user = await userRepo.findbyId(id);
    return user;
  },
  // findByRoleName: async (name) => {
  //   if (!name) return null;
  //   const result = await userRepo.findByRoleName(name);
  //   return result;
  // }
};
