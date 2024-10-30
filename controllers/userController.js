const userServices = require("../services/user");

module.exports = {
  findbyName: async (req, res) => {
    try {
      const result = await userServices.findbyName(
        req.body.name,
        req.body.password
      );
      if (result === 404)
        return res.status(404).json({ message: "User not found" });
      if (result === 401)
        return res.status(401).json({ message: "Invalid password" });
      res.cookie("token", result.token, { httpOnly: true });
      let findByRoleId = await userServices.findByRoleId(result.result.roles)
      if(!findByRoleId) return res.json({message : "Lỗi "})
      if ( findByRoleId.name === "Admin") {
        return res.redirect("/api/v1/admin");
      }
      if ( findByRoleId.name === "Editor") {
        return res.redirect("/api/v1/editor");
      }
      return res.redirect("/api/v1/user");
    } catch (error) {
      console.log(error);
      res.send("Lỗi hệ thống");
    }
  },
  create: async (req, res) => {
    try {
      if (!req.body)
        return res.status(400).json({ message: "Không thấy not found" });

      let _idRole = await userServices.findByRoleName("User")
      req.body.roles = _idRole; // mặc định là user
      req.body.status = 0;
      const result = await userServices.createUser(req.body);
      res.redirect("/login");
      // res.json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  createAdmin: async (req, res) => {
    try {
      if (!req.body)
        return res.status(400).json({ message: "Không có dữ liệu" });
      let _idRole;
      if( req.params.role === "admin" ){
        _idRole = await userServices.findByRoleName("Admin") 
        req.body.roles = _idRole;
      }
      else if(req.params.role === "editor"){
        _idRole = await userServices.findByRoleName("Editor")
        req.body.roles =  _idRole; ;
      } else{
        _idRole = await userServices.findByRoleName("User")
        req.body.roles = _idRole;
      }
      req.body.status = 0;
      const result = await userServices.createUser(req.body);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  updateUser: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await userServices.find(id);
      if (!result)
        return res.status(400).json({ message: "Không thể not found" });
      if (!req.body)
        return res.status(400).json({ message: "Không thể not found" });

      const result2 = await userServices.updateUser(id,req.body)
      res.json(result2);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await userServices.find(id);
      if (!result)
        return res.status(400).json({ message: "Không thể not found" });
      const result2 = await userServices.deleteUser(id);
      // console.log(result)
      res.json(result2);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
};
