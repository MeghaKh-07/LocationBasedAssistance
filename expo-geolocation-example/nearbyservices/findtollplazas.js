import * as SQLite from 'expo-sqlite';
import axios from 'axios';

const db = SQLite.openDatabase('NHIGHWAYS.db');
// Function to get all highway data from the database
const getAllHighwaysData = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM Highways',
                [],
                (_, { rows }) => {
                    console.log('Highways data:');
                    const highways = rows._array;
                    //console.log(highways);
                    resolve(highways);
                },
                error => {
                    console.error('Error fetching data from Highways table:', error);
                    reject(error);
                }
            );

        });
    });
};
//const calculateDistance = async (lat1, lon1, lat2, lon2) => {
    /*const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance; 
}; */

const calculateDistance = async (lat1, lon1, lat2, lon2) => {
    const apiKey = 'AIzaSyCEBGFngMAB5YR1Zynfm6SuKUMwzgfFssU'; // Replace 'YOUR_API_KEY' with your actual API key
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat1},${lon1}&destinations=${lat2},${lon2}&units=imperial&key=${apiKey}`;
    
    try {
        const response = await axios.get(url);
        //console.log("Distance API response:", response.data.rows[0].elements[0].distance.value);
        //const distanceText = response.data.rows[0].elements[0].distance.text; // Distance as text (e.g., "10 mi")
        const distanceValue = response.data.rows[0].elements[0].distance.value; // Distance in meters
        //console.log(distanceValue);
        return distanceValue;
    } catch (error) {
        console.error("Error fetching distance:", error);
        return null;
    }
};

export const findNearestTollPlaza = async (latitude,longitude,HighwayNumber) => {

    console.log(latitude);
    try {
        const highwaysData = await getAllHighwaysData();
        // Filter highways by matching highway number
        console.log(highwaysData);
        const matchingHighway = highwaysData.find(highway => highway.highwayNumber === HighwayNumber);
        //return matchingHighway;
        if (matchingHighway) {
            console.log("matching" , matchingHighway);
            // If highway number matches, return the data
            return matchingHighway;
        } else {
            const tollPlazaDataPromises = highwaysData.map(async (highway) => {
                //console.log(highway);
                try {
                    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(highway.tollPlazaAddress)}&key=AIzaSyCEBGFngMAB5YR1Zynfm6SuKUMwzgfFssU`);
                    const { results } = response.data;
                    if (results && results.length > 0) {
                        const location = results[0].geometry.location;
                        //console.log(location);
                        //const distance = calculateDistance(latitude, longitude, location.lat, location.lng);
                        //console.log(distance);

                        return calculateDistance(latitude, longitude, location.lat, location.lng)
                        .then(distance => {

                            if (distance !== null) {
                                //console.log(distance);
                                return {
                                    id: highway.id, // Assuming the ID field in the database is named 'id'
                                    //address: highway.tollPlazaAddress,
                                    latitude: location.lat,
                                    longitude: location.lng,
                                    distance: distance
                                };
                                //console.log("Distance:", distance, "meters");
                                }
                            })
                            .catch(err => console.error(err));
                    } else {
                        return null; // Unable to geocode address
                    }
                } catch (error) {
                    console.error('Error geocoding address:', error);
                    return null;
                }
            });

            const tollPlazaData = await Promise.all(tollPlazaDataPromises);
            //console.log("tollplaza " , tollPlazaData);
            //console.log(tollPlazaData.filter(plaza => plaza !== null));
            const sortedTollPlazas = tollPlazaData.filter(plaza => plaza !== null).sort((a, b) => a.distance - b.distance);
            //console.log("sortedTollPlazas" , sortedTollPlazas);
            //console.log(sortedTollPlazas);
            // Fetch entire data for each toll plaza using its ID
            const detailedTollPlazas = await Promise.all(sortedTollPlazas.map(async (plaza) => {
                try {
                    const detailedPlaza = await getTollPlazaById(plaza.id);
                    //console.log(detailedPlaza); // Implement this function to fetch data by ID from your database
                    return { ...plaza, ...detailedPlaza };
                } catch (error) {
                    console.error('Error fetching detailed toll plaza data:', error);
                    return null;
                }
            }));
            console.log("fetched toll plaza" ,detailedTollPlazas[0]);
            const finaltollplaza =  detailedTollPlazas.filter(plaza => plaza !== null)[0];
            console.log(finaltollplaza);
            return finaltollplaza;
        }
    } catch (error) {
        console.error('Error finding nearest toll plaza:', error);
        throw error;
    }
};

// Implement this function to fetch detailed toll plaza data by ID
const getTollPlazaById = async (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM Highways WHERE id = ?',
                [id],
                (_, { rows }) => {
                    const plaza = rows._array[0];
                    resolve(plaza);
                },
                error => {
                    console.error('Error fetching toll plaza data by ID:', error);
                    reject(error);
                }
            );
        });
    });
};
