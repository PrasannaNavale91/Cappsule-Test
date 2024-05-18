import axios from 'axios';
import Medicine from '../models/Medicine.js';

export const fetchAndStoreData = async (req, res) => {
  try {
    const { q, pharmacyIds } = req.query;
    const response = await axios.get(`https://backend.cappsule.co.in/api/v1/new_search?q=${q}&pharmacyIds=${pharmacyIds}`);
    const searchData = response.data.data.saltSuggestions;

    await Medicine.deleteMany({});
    await Medicine.insertMany(searchData);

    res.status(200).json({ message: 'Data stored in database successfully' });
  } catch (error) {
    console.error('Error fetching and storing data:', error);
    res.status(500).json({ message: 'Error fetching and storing data', error: error.message });
  }
};

export const getStoredData = async (req, res) => {
  try {
    const medicines = await Medicine.find({});
    res.status(200).json(medicines);
  } catch (error) {
    console.error('Error retrieving data from database:', error);
    res.status(500).json({ message: 'Error retrieving data from database' });
  }
};

export const getLowestPricePharmacy = async (req, res) => {
  try {
    const { form, strength, packing } = req.body;

    const medicines = await Medicine.find({
      'most_common.Form': form,
      'most_common.Strength': strength,
      'most_common.Packing': packing
    });

    if (medicines.length === 0) {
      return res.status(404).json({ message: 'No medicines found for selected combination' });
    }

    const lowestPriceMedicine = medicines.reduce((prev, current) => (
      prev.price < current.price ? prev : current
    ));

    res.status(200).json({ pharmacy: lowestPriceMedicine.pharmacy });
  } catch (error) {
    console.error('Error fetching lowest price pharmacy:', error);
    res.status(500).json({ message: 'Error fetching lowest price pharmacy', error: error.message });
  }
};