import { findNearestTollPlaza } from "./findtollplazas";

export const fetchNearbyTollPlazas = async (latitude, longitude , HighwayName) => {

    try {
        const nearestTollPlaza = await findNearestTollPlaza(latitude, longitude, HighwayName);
        console.log(HighwayName);
        if (nearestTollPlaza) {
            // Handle the found toll plaza data
            console.log('Nearest Toll Plaza:', nearestTollPlaza.tollPlazaAddress);
            return nearestTollPlaza;r
        } else {
            console.log('No matching toll plaza found.');
        }
    } catch (error) {
        console.error('Error fetching nearby toll plazas:', error);
        throw error;
    }
};

