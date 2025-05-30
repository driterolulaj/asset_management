// 23. models/user.js (example for password encryption)
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    role: DataTypes.STRING,
refreshToken: {
  type: DataTypes.STRING,
  allowNull: true,
},
  });

  User.beforeCreate(async (user) => {
    user.password = await require('bcryptjs').hash(user.password, 10);
  });

  return User;
};
