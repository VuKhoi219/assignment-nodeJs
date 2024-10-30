const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const secretkey = "secretkey";
const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Không tìm thấy token" });
  }
  jwt.verify(token, secretkey, async (err, user) => {
    if (err) return res.status(403).json({ message: "Token không hợp lệ" });
    req.user = user;
    next();
  });
};

const check = async (req, res, next) => {
  try {
    let user = null;
    const userId = req.user._id;
    user = await User.find({ _id: userId }, { password: 0 }).populate({
      path: "roles",
      populate: {
        path: "permissions",
      },
    });
    let userPermissions = user[0].roles.reduce((acc,role)=>{
      role.permissions.forEach(permission => {
        acc.push({url : permission.url, method : permission.method})
        
      });
      return acc
    },[])
    const hasPermission = userPermissions.some(
      (p) => req.url.includes(p.url) && p.method === req.method
    );
    if (!hasPermission)
      return res.status(403).json({ message: "Không có quyền truy cập" });
    next();
  }catch(e){
    console.log(e)
    return res.status(500).json({ message: "Có lỗi xảy ra" });
  }
}
const checkPermission = async (req, res, next) => {
  return await check(req, res, next);
};
module.exports = {
  authenticateToken,
  checkPermission,
};
