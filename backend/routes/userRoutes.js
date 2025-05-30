const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireSuperadmin } = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.get('/', requireSuperadmin, userController.getAllUsers);
router.post('/', requireSuperadmin, userController.createUser);
router.put('/:id', requireSuperadmin, userController.updateUser);
router.delete('/:id', requireSuperadmin, userController.deleteUser);
module.exports = router;
