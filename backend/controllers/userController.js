const { User } = require('../models');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ username, password: hashedPassword, role });
  res.status(201).json(newUser);
};

exports.getAllUsers = async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ['password'] } });
  res.json(users);
};

exports.updateUser = async (req, res) => {
  const { username, role } = req.body;
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.username = username;
  user.role = role;
  await user.save();
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await user.destroy();
  res.json({ message: 'User deleted successfully' });
};