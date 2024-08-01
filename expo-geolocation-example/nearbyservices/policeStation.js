const fetchNearbyPoliceStations = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=police&keyword=police&name=police&key=AIzaSyCEBGFngMAB5YR1Zynfm6SuKUMwzgfFssU`
    );
    const data = await response.json();

    if (data.results.length > 0) {
      //console.log("police stations" , data.results);
      const stations = data.results.slice(0, 5).map((station) => ({
        name: station.name,
        location: station.geometry.location,
        distance: calculateDistance(
          latitude,
          longitude,
          station.geometry.location.lat,
          station.geometry.location.lng
        ),
        place_id: station.place_id,
      }));

      // Find the police station with the minimum distance
      const minDistanceStation = stations.reduce((min, station) =>
        min.distance < station.distance ? min : station
      );
      console.log("minDistance " ,minDistanceStation);
      const detailedResponse = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${minDistanceStation.place_id}&fields=name,formatted_address,formatted_phone_number,opening_hours,geometry&key=AIzaSyCEBGFngMAB5YR1Zynfm6SuKUMwzgfFssU`
      );
      const detailedData = await detailedResponse.json();

      //console.log("Detailed information about the nearest police station:", detailedData.result);
      
      return detailedData;
    } else {
      throw new Error('No police stations found within 10km radius.');
    }
  } catch (error) {
    console.error('Error fetching nearby police stations:', error);
    throw error;
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

export default fetchNearbyPoliceStations;
