import { Router } from 'express';
import multer from 'multer';
import { authMiddleware, authorizeRoles } from '../middleware/auth';
import { createInventory, uploadCSV, listInventories } from '../controllers/inventoryController';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Create inventory manually
router.post('/', authMiddleware, authorizeRoles('admin', 'media_owner', 'aggregator'), createInventory);

// CSV upload
router.post('/upload', authMiddleware, authorizeRoles('admin', 'media_owner', 'aggregator'), upload.single('file'), uploadCSV);

// List inventories
router.get('/', authMiddleware, listInventories);

export default router;
