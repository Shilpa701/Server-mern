import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWTPASSWORD);
    if (verified.role !== "admin") {
      return res.status(403).json({ message: "Not authorized as admin" });
    }
    req.admin = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

export default adminAuth;
