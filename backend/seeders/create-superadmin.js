const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('supersecure', 10);
    return queryInterface.bulkInsert('Users', [{
      username: 'superadmin',
      password: hashedPassword,
      role: 'superadmin',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', { username: 'superadmin' });
  }
};