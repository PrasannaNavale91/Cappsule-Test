import express from "express";
import { getStoredData , fetchAndStoreData , getLowestPricePharmacy } from '../controllers/medicineController.js';

const router = express.Router();

router.get('/fetch-data', fetchAndStoreData);
router.get('/get-stored-data', getStoredData);
router.post('/fetch-lowest-price-pharmacy', getLowestPricePharmacy);

export default router;