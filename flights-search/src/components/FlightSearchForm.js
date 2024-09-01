import React, { useState, useEffect } from 'react';
import './FlightSearchForm.css';

const FlightSearchForm = ({ onSearch }) => {
    const [formData, setFormData] = useState({
        departure: '',
        destination: '',
        departureDate: '',
        returnDate: '',
        numberOfPassengers: 1,
        currency: ''
    });

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setFormData(prevData => ({ ...prevData, departureDate: today }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(formData);
    };

    return (
        <div className="form-container">
            <h2>Search Flights</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Departure:
                    <input
                        type="text"
                        name="departure"
                        value={formData.departure}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Destination:
                    <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Departure Date:
                    <input
                        type="date"
                        name="departureDate"
                        value={formData.departureDate}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Return Date:
                    <input
                        type="date"
                        name="returnDate"
                        value={formData.returnDate}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Number of Passengers:
                    <input
                        type="number"
                        name="numberOfPassengers"
                        value={formData.numberOfPassengers}
                        onChange={handleChange}
                        min="1"
                    />
                </label>
                <label>
                    Currency:
                    <input
                        type="text"
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Search</button>
            </form>
        </div>
    );
};

export default FlightSearchForm;
