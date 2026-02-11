const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// -------- helpers --------
const signToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};

const sendUserAuth = (res, user, statusCode = 200) => {
  const token = signToken(user);
  return res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

const sendAdminAuth = (res, admin, statusCode = 200) => {
  const token = signToken(admin);
  return res.status(statusCode).json({
    success: true,
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
};

// ================================
// USER REGISTER  POST /api/users/register
// IMPORTANT: do NOT hash here (model pre-save hashes)
// ================================
exports.registerUser = async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password, // plain -> model hashes
      role: "user",
    });

    return sendUserAuth(res, user, 201);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ================================
// USER LOGIN  POST /api/users/login
// ================================
exports.loginUser = async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = await User.findOne({ email, role: "user" });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    return sendUserAuth(res, user, 200);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ================================
// ADMIN REGISTER  POST /api/users/admin/register
// IMPORTANT: do NOT hash here (model pre-save hashes)
// ================================
exports.registerAdmin = async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    const admin = await User.create({
      name,
      email,
      password, // plain -> model hashes
      role: "admin",
    });

    return sendAdminAuth(res, admin, 201);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ================================
// ADMIN LOGIN  POST /api/users/admin/login
// ================================
exports.loginAdmin = async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password;

    console.log("ADMIN LOGIN ATTEMPT:", { email, hasPassword: !!password });

    const admin = await User.findOne({ email, role: "admin" });
    console.log("ADMIN FOUND?", !!admin, admin ? { id: admin._id, role: admin.role } : null);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials: admin not found (wrong email or role not admin)",
      });
    }

    const ok = await bcrypt.compare(password, admin.password);
    console.log("PASSWORD MATCH?", ok);

    if (!ok) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials: password mismatch",
      });
    }

    // return admin the way frontend expects:
    const token = jwt.sign(
      { id: admin._id.toString(), role: admin.role, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    return res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.log("ADMIN LOGIN ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ================================
// UPDATE USER PROFILE  PUT /api/users/profile (protected)
// IMPORTANT: findByIdAndUpdate bypasses pre('save'), so hash manually here
// ================================
exports.updateUser = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const updates = {};
    if (req.body.name) updates.name = req.body.name.trim();

    if (req.body.password) {
      updates.password = await bcrypt.hash(req.body.password, 10);
    }

    const updated = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    return res.json({ success: true, user: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};