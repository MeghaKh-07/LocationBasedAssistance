const fetchNearbyPoliceStations = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=police&key=AIzaSyCEBGFngMAB5YR1Zynfm6SuKUMwzgfFssU`
    );
    const data = await response.json();

    if (data.results.length > 0) {
      const stations = data.results.map((station) => ({
        name: station.name,
        location: station.geometry.location,
      }));
      return stations;
    } else {
      throw new Error('No police stations found within 5km radius.');
    }
  } catch (error) {
    console.error('Error fetching nearby police stations:', error);
    throw error;
  }
};

export default fetchNearbyPoliceStations;
