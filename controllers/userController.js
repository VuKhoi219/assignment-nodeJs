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
      console.log(result.result.roles);
      if (
        result.result.roles
          .map((role) => role.toString())
          .includes("671f62711bbab74598c72cb8")
      ) {
        return res.redirect("/api/admin");
      }

      if (
        result.result.roles
          .map((role) => role.toString())
          .includes("671f62711bbab74598c72cb9")
      ) {
        return res.redirect("/api/editor");
      }
      return res.redirect("/api/user");
    } catch (error) {
      console.log(error);
      res.send("Lỗi hệ thống");
    }
  },
  create: async (req, res) => {
    try {
      if (!req.body)
        return res.status(400).json({ message: "Không thấy not found" });
      // 671f62711bbab74598c72cbc user
      //  671f62711bbab74598c72cb8 admin
      // 671f62711bbab74598c72cb9 editor
      req.body.roles = "671f62711bbab74598c72cbc"; // mặc định là user
      req.body.status = 0;
      console.log(req.body);
      const result = await userServices.createUser(req.body);
      // console.log(result)
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
      // 671f62711bbab74598c72cbc user
      //  671f62711bbab74598c72cb8 admin
      // 671f62711bbab74598c72cb9 editor
      console.log(req.params.role)
      if( req.params.role === "admin" ){
        req.body.roles = "671f62711bbab74598c72cb8";
      }
      else if(req.params.role === "editor"){
        req.body.roles = "671f62711bbab74598c72cb9";
      } else{
        req.body.roles = "671f62711bbab74598c72cbc";
      }
      req.body.status = 0;
      console.log(req.body);
      const result = await userServices.createUser(req.body);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  updateUser: async (req, res) => {
    try {
      const id = req.body.id;
      const result = await userServices.find(id);
      if (!result)
        return res.status(400).json({ message: "Không thể not found" });
      if (!req.body)
        return res.status(400).json({ message: "Không thể not found" });
      console.log(result)
      console.log(req.body)
      const result2 = await userServices.updateUser(req.body)
      // console.log(result)
      
      res.json(result2);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const id = req.body.id;
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
