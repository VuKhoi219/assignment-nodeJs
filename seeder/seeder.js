const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
require("dotenv").config();
const { Permission, User, Role } = require("../models/user");
const { hashPassword } = require("../services/bcrypt");
mongoose
  .connect(process.env.MONGOOSE_URL, {})
  .then(() => {
    console.log(process.env.MONGOOSE_URL, "Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  });
const seedUsers = async () => {
  const permissionData = [
    {
      name: "Update",
      url: "/api/v1/admin/",
      method: "PUT",
    },
    {
      name: "Delete",
      url: "/api/v1/admin/",
      method: "DELETE",
    },
    {
      name: "User",
      url: "/api/v1/user",
      method: "GET",
    },
    {
      name: "Editor",
      url: "/api/v1/editor",
      method: "GET",
    },
    {
      name: "Admin",
      url: "/api/v1/admin",
      method: "GET",
    },
    {
      name: "Admin create Admin",
      url: "/api/v1/admin/admin",
      method: "POST",
    },
    {
      name: "Admin create Editor",
      url: "/api/v1/admin/editor",
      method: "POST",
    },
    {
      name: "Admin create User",
      url: "/api/v1/admin/user",
      method: "POST",
    }
  ];
  await Permission.insertMany(permissionData);
  const permissionIdAll = await Permission.find(
    {},
    { _id: 1, name: 1 }
  );
  let permissionIdAdmin = [];
  let permissionIdEditor = [];
  let permissionIdUser = [];
  for (let i = 0; i < permissionIdAll.length; i++) {

    if (permissionIdAll[i].name !== "Editor" && permissionIdAll[i].name !== "User") {
      permissionIdAdmin.push(permissionIdAll[i]._id);
    }

    if (
      permissionIdAll[i].name === "Editor"
    ) {
      permissionIdEditor.push(permissionIdAll[i]._id);
    }
    if (
      permissionIdAll[i].name === "User"  
    ) {
      permissionIdUser.push(permissionIdAll[i]._id);
    }
  }
  const roleData = [
    {
      name: "Admin",
      permissions: permissionIdAdmin,
    },
    {
      name: "Editor",
      permissions: permissionIdEditor,
    },
    {
      name: "Manager",
      permissions: permissionIdEditor,
    },
    {
      name: "Viewer",
      permissions: permissionIdEditor,
    },
    {
      name: "User",
      permissions: permissionIdUser,
    },
  ];
  await Role.insertMany(roleData);
  const roleAll = await Role.find({}, { _id: 1, name: 1 });
  let roleEditor = [];
  let roleUser = [];
  let roleAdmin = [];
  for (let i = 0; i < roleAll.length; i++) {
    if (roleAll[i].name === "Admin") {
      roleAdmin.push(roleAll[i]._id);
    } if (roleAll[i].name === "Editor") {
      roleEditor.push(roleAll[i]._id);
    } if (roleAll[i].name === "User") {
      roleUser.push(roleAll[i]._id);
    }
  }
  let userData = [];
  for (let i = 0; i < 10; i++) {
    // Chọn ngẫu nhiên một trong ba mảng
    const selectedRoleArray = faker.helpers.arrayElement([
      roleEditor,
      roleUser,
      roleAdmin,
    ]);
    const password = await hashPassword(faker.internet.password());

    const userData1 = new User({
      name: faker.name.fullName(),
      password: password,
      roles: selectedRoleArray,
      status: faker.number.int({ min: -1, max: 0 }),
    });
    userData.push(userData1);
  }
  await User.insertMany(userData);
  console.log("Data seeded successfully");
};
seedUsers();
