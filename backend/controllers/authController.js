const jwt = require("jsonwebtoken");
const { User } = require("../models");
const bcrypt = require("bcryptjs");

const generateAccessToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

const generateRefreshToken = (user) =>
  jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('[PASSWORD VALID]', isMatch);

    if (!isMatch) return res.status(401).json({ message: "Invalid password" });
    console.log('[LOGIN]', { username });

    console.log('[FOUND USER]', user);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user); // ✅ now defined

    await User.update({ refreshToken }, { where: { id: user.id } });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // set true in production with HTTPS
      sameSite: "lax",
    });

    res.json({
      token: accessToken,
      user: { id: user.id, username: user.username, role: user.role },
      expiresIn: 60 * 60 * 1000,
    });
  } catch (err) {
    console.error('[LOGIN ERROR]', err); // ✅ helpful for debugging
    res.status(500).json({ message: "Server error" });
  }
};


exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(403).json({ message: "No refresh token provided" });

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findByPk(payload.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user);
    res.json({ token: newAccessToken, expiresIn: 60 * 60 * 1000 });
  } catch (err) {
    res.status(403).json({ message: "Token verification failed" });
  }
};

exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    res.clearCookie("refreshToken");

    if (refreshToken) {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      await User.update({ refreshToken: null }, { where: { id: payload.id } });
    }

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: "Logout failed" });
  }
};
