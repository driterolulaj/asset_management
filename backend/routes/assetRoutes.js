// 26. routes/assetRoutes.js
const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.get('/', assetController.getAllAssets);
router.post('/', assetController.createAsset);
router.put('/:id', assetController.updateAsset);
router.delete('/:id', assetController.deleteAsset);

module.exports = router;
