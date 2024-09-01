import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FlightSearchForm from './components/FlightSearchForm';
import FlightResultsTable from './components/FlightResultsTable';

function App() {
    const [flightOffers, setFlightOffers] = useState([]);
    const [numberOfPassengers, setNumberOfPassengers] = useState(1);
    const [searchParams, setSearchParams] = useState({});

    useEffect(() => {
        const storedData = localStorage.getItem('flightSearchData');
        if (storedData) {
            const { flightOffers, numberOfPassengers, searchParams } = JSON.parse(storedData);
            setFlightOffers(flightOffers);
            setNumberOfPassengers(numberOfPassengers);
            setSearchParams(searchParams);
        }
    }, []);

    const handleSearch = async (formData) => {
        const params = new URLSearchParams({
            origin: formData.departure,
            destination: formData.destination,
            departureDate: formData.departureDate,
            adults: formData.numberOfPassengers,
            currency: formData.currency
        }).toString();
    
        console.log('Search parameters:', params);
    
        const cacheKey = `flightSearchData-${params}`;
        const cachedData = localStorage.getItem(cacheKey);
    
        if (cachedData) {
            console.log('Loaded cached data:', JSON.parse(cachedData));
            const { flightOffers, numberOfPassengers } = JSON.parse(cachedData);
            setFlightOffers(flightOffers);
            setNumberOfPassengers(numberOfPassengers);
            return;
        }
    
        try {
            const response = await axios.get(`http://localhost:5088/api/FlightResults/search?${params}`);
            const resultData = response.data;
    
            console.log('Fetched data from API:', resultData);
            
            //uPDATE
            setFlightOffers(Array.isArray(resultData) ? resultData : [resultData]);
            setNumberOfPassengers(formData.numberOfPassengers);
    
            // Save to local storage
            localStorage.setItem(cacheKey, JSON.stringify({
                flightOffers: Array.isArray(resultData) ? resultData : [resultData],
                numberOfPassengers: formData.numberOfPassengers
            }));
    
            console.log('Data saved to local storage');
        } catch (error) {
            console.error('Error fetching flight offers:', error);
        }
    };

    return (
        <div className="App">
            <h1>Flight Search</h1>
            <FlightSearchForm onSearch={handleSearch} />
            <FlightResultsTable data={flightOffers} numberOfPassengers={numberOfPassengers} />
        </div>
    );
}

export default App;
