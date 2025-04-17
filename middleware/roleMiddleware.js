export const authorizeRoles = (...roles) => {
  console.log("roles", roles);
    return (req, res, next) => {
      console.log("req.user.role", req.user);
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden: Role access denied" });
      } 
      next();
    };
  };