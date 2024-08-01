export const fetchNearbyHospitals = async (latitude, longitude) => {
    const API_KEY = 'AIzaSyCEBGFngMAB5YR1Zynfm6SuKUMwzgfFssU'; // Replace with your actual API key
    const radius = 1500; // Search radius in meters (adjust as needed)

    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=hospital&keyword=hospital&name=hospital&key=${API_KEY}`);
        const data = await response.json();
        
        if (data.status === 'OK' && data.results.length > 0) {
            // Find the nearest hospital
            const sortedHospitals = data.results.map(hospital => ({
                ...hospital,
                distance: calculateDistance(latitude, longitude, hospital.geometry.location.lat, hospital.geometry.location.lng)
            })).sort((a, b) => a.distance - b.distance);
            const top5Hospitals = sortedHospitals.slice(0, 5);
            //console.log("top5",top5Hospitals)
            const hospitalsWithOpeningHours = await Promise.all(top5Hospitals.map(hospital => fetchHospitalDetails(hospital.place_id)));
            const openHospital = hospitalsWithOpeningHours.find(hospital => hospital.opening_hours && hospital.opening_hours.open_now);
           // console.log("open " ,hospitalsWithOpeningHours);
            //console.log("top5Hospitals " , top5Hospitals); 
            if (openHospital) {
                return {
                    name: openHospital.name,
                    vicinity: openHospital.formatted_address,
                    location: openHospital.geometry.location,
                    opening_hours : "open",
                    Phone : openHospital.formatted_phone_number
                };
            } else {
                // If none of the top 5 hospitals are open, return the nearest hospital
                return {
                    name: sortedHospitals[0].name,
                    vicinity: sortedHospitals[0].vicinity,
                    location: sortedHospitals[0].geometry.location,
                    opening_hours : "closed",
                    Phone :sortedHospitals[0].formatted_phone_number
                };
            }
        } else {
            throw new Error('Unable to fetch nearby hospitals. Please try again later.');
        }
    } catch (error) {
        throw new Error(error.message);
    }
};
const fetchHospitalDetails = async (place_id) => {
    const API_KEY = 'AIzaSyCEBGFngMAB5YR1Zynfm6SuKUMwzgfFssU'; // Replace with your actual API key

    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,formatted_address,formatted_phone_number,opening_hours,geometry&key=${API_KEY}`);
        const data = await response.json();
        //console.log(data)
        
        if (data.status === 'OK') {
            
            return data.result;
        } else {
            throw new Error('Unable to fetch hospital details. Please try again later.');
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

// Function to calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return distance;
}

// Function to convert degrees to radians
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
