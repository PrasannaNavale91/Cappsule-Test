import React, { useState } from 'react';
import axios from 'axios';
import './index.css';
import { CiSearch } from "react-icons/ci";
import { GoArrowLeft } from "react-icons/go";

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [selectedForm, setSelectedForm] = useState('');
  const [selectedStrength, setSelectedStrength] = useState('');
  const [selectedPacking, setSelectedPacking] = useState('');
  const [lowestPrice, setLowestPrice] = useState(null);
  const [showDiscountMessage, setShowDiscountMessage] = useState(true);
  const [isSearchClicked, setIsSearchClicked] = useState(false);

  const handleSearch = async () => {
    try {
      // Trigger fetch and store data on the backend
      await axios.get('http://localhost:3000/api/medicines/fetch-data', {
        params: { q: searchQuery, pharmacyIds: '1,2,3' }
      });

      // Fetch stored data from the backend
      const response = await axios.get('http://localhost:3000/api/medicines/get-stored-data');
      console.log('Fetched data:', response.data);
      setMedicines(response.data);

      setShowDiscountMessage(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to get unique values for sorting options
  const getUniqueValues = (data, key) => {
    if (!Array.isArray(data)) return [];
    return [...new Set(data.map(item => item.most_common[key]))];
  };

  const handleGetLowestPrice = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/medicines/fetch-lowest-price-pharmacy', {
        form: selectedForm,
        strength: selectedStrength,
        packing: selectedPacking
      });
      setLowestPrice(response.data.pharmacy ? response.data.pharmacy.price : null);
    } catch (error) {
      console.error('Error fetching lowest price:', error);
      setLowestPrice(null);
    }
  };

  return (
    <>
      <div className="search-screen">
        <h1>Cappsule Web Development Test</h1>
        <div className="search-form">
          { isSearchClicked ? (
            <GoArrowLeft onClick={ handleSearch => setIsSearchClicked(true)} />
          ) : (
            <CiSearch onClick={ handleSearch => setIsSearchClicked(false)} />
          ) }
          <input
            type="text"
            placeholder="Type your medicine name here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        {showDiscountMessage && <p className='text-card'>"Find medicines with amazing discount"</p>}
        <div className="results">
          {medicines.map((medicine, index) => (
            <div key={index} className="medicine-result">
              <div className="filter-column">
                {selectedForm === '' && (
                  <div>
                    {getUniqueValues(medicines, 'Form').map((form, index) => (
                      <button key={index} onClick={() => setSelectedForm(form)}>{form}</button>
                    ))}
                  </div>
                )}
                {selectedForm !== '' && selectedStrength === '' && (
                  <div>
                    <h4>Strength</h4>
                    {getUniqueValues(medicines.filter(item => item.most_common.Form === selectedForm), 'Strength').map((strength, index) => (
                      <button key={index} onClick={() => setSelectedStrength(strength)}>{strength}</button>
                    ))}
                  </div>
                )}
                {selectedStrength !== '' && selectedPacking === '' && (
                  <div>
                    <h4>Packing</h4>
                    {getUniqueValues(medicines.filter(item => item.most_common.Form === selectedForm && item.most_common.Strength === selectedStrength), 'Packing').map((packing, index) => (
                      <button key={index} onClick={() => setSelectedPacking(packing)}>{packing}</button>
                    ))}
                  </div>
                )}
              </div>
              <div className="salt-column">
                {medicines.map((medicine, index) => (
                  <div key={index}>
                    <p>Salt {String.fromCharCode(65 + index)}: {medicine.salt}</p>
                  </div>
                ))}
              </div>
              <div className="price-column">
                {selectedForm !== '' && selectedStrength !== '' && selectedPacking !== '' && (
                  <button onClick={handleGetLowestPrice}>Get Lowest Price</button>
                )}
                {medicines.map((medicine, index) => (
                  <div key={index}>
                    <p>Salt {String.fromCharCode(65 + index)} Price: {lowestPrice !== null ? `$${lowestPrice}` : 'No stores selling this product near you'}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default App;