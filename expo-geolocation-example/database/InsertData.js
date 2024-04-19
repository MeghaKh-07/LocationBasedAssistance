import { insertHighway } from "./highwaydb";

const highways = [
{
    highwayNumber: 'NH-52',
    tollPlazaAddress: '32, Girdhar Enclave, City Rd, near Exotica Resort, Kunadi, Electricity Board Area, Kota, Rajasthan 324008',
    craneNumber: 8218516389,
    ambulanceNumber: 7374035907,
    routePatrolNumber: 9166995135,
    regionalOffice: 'RO Jaipur',
    nearestPoliceStationName: 'Hindoli',
    nearestPoliceStationPHN: 0+7436276232,
    nearestHospital:'Hindoli',
    emergencyNumber: 1033
  },
  {
    highwayNumber: 'NH-76',
    tollPlazaAddress: 'Parshvnath Residency . Exotica, A-43, Canal Rd, Kunadi, Electricity Board Area, KOta, Rajasthan 324008',
    craneNumber: 8058403235,
    ambulanceNumber: 7374035907,
    routePatrolNumber: 9784497536,
    regionalOffice: 'RO Jaipur',
    nearestPoliceStationName: 'Kishanganj',
    nearestPoliceStationPHN: 1033,
    nearestHospital:'Hospital C',
    emergencyNumber: 1033
  },
];
  
export const insertHighwaysData = () => {
  highways.forEach(highway => {
    insertHighway({
      highwayNumber: highway.highwayNumber,
      tollPlazaAddress: highway.tollPlazaAddress,
      craneNumber: highway.craneNumber,
      ambulanceNumber: highway.ambulanceNumber,
      routePatrolNumber: highway.routePatrolNumber,
      regionalOffice: highway.regionalOffice,
      nearestPoliceStationName:highway.nearestPoliceStationName,
      nearestPoliceStationPHN:highway.nearestPoliceStationPHN,
      nearestHospital: highway.nearestHospital,
      emergencyNumber: highway.emergencyNumber
    });
    console.log("Inserted highway data:", highway);
  });
};
