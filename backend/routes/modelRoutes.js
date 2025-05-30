// 27. routes/modelRoutes.js
const express = require('express');
const router = express.Router();
const modelController = require('../controllers/modelController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.get('/', modelController.getAllModels);
router.post('/', modelController.createModel);
router.put('/:id', modelController.updateModel);
router.delete('/:id', modelController.deleteModel);

module.exports = router;