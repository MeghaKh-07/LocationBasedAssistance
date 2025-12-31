import { insertHighway } from "./highwaydb";

const highways = [
  {
    highwayNumber: 'NH-27',
    TollPlazaName : 'Simliy Toll Plaza',
    tollPlazaAddress: 'Kareerka Khe, Rajasthan 325201, India',
    craneNumber: 8003334643,
    ambulanceNumber: 7374035907,
    routePatrolNumber: 7374035907,
    regionalOffice: 'RO Jaipur',
    nearestPoliceStationName: 'Simaliya',
    nearestPoliceStationPHN: '07455222326',
    nearestHospital:'Govt. Hospital , Anta Hospital , Anta',
    emergencyNumber: 1033
  },
{
    highwayNumber: 'NH-52',
    TollPlazaName : 'Barkheda Toll Plaza',
    tollPlazaAddress: 'MWQ3+7V9, NH 12, Barkhera, Rajasthan 303903, India',
    craneNumber: 1033,
    ambulanceNumber: 1033,
    routePatrolNumber: 1033,
    regionalOffice: 'RO Jaipur',
    nearestPoliceStationName: 'Shivdaspura Police Station',
    nearestPoliceStationPHN: '01429277222',
    nearestHospital:'Kedawat Hospital National Highway 12, Sanganer Tonk Rd Sichai Nagar,Sitapura Industrial Area , Sitapura Jaipur , Rajasthan',
    emergencyNumber: 1033
  },
{
    highwayNumber: 'NH-76',
    TollPlazaName : 'Fatehpur Toll Plaza',
    tollPlazaAddress: '4HCC+4MQ, NH 27, Fatehpur, Rajasthan 325205, India',
    craneNumber: 8058403235,
    ambulanceNumber: 9413222448,
    routePatrolNumber: 9784497536,
    regionalOffice: 'RO Jaipur',
    nearestPoliceStationName: 'Kishanganj',
    nearestPoliceStationPHN: '9784497536',
    nearestHospital:'radha krishna memorial hospital Baran , Rajasthan',
    emergencyNumber: 1033
  },
{
    highwayNumber: 'NH-116',
    TollPlazaName : 'Gumanpura Toll Plaza',
    tollPlazaAddress: 'Gumanpura, Shyodaspura, Rajasthan 304024, India',
    craneNumber: 1033,
    ambulanceNumber: 1033,
    routePatrolNumber: 1033,
    regionalOffice: 'RO Jaipur',
    nearestPoliceStationName: 'Uniara Police Station',
    nearestPoliceStationPHN: '1436265328',
    nearestHospital:'Govt. Hospital Uniara',
    emergencyNumber: 1033
  },
{
    highwayNumber: 'NH-52',
    TollPlazaName : 'Kishorepura Toll Plaza',
    tollPlazaAddress: 'Pech Ki Ghani, Bundi NH-12, Kota Rd, Bundi, Rajasthan 323023, India',
    craneNumber: 8218516389,
    ambulanceNumber: 9166110027,
    routePatrolNumber: 9166995135,
    regionalOffice: 'RO Jaipur',
    nearestPoliceStationName: 'Hindoli',
    nearestPoliceStationPHN: '07436276232',
    nearestHospital:'Govt. Hospital Hindoli',
    emergencyNumber: 1033
  },
{
    highwayNumber: 'NH-27',
    TollPlazaName : 'Toll Plaza Kota Bypass hanging bridge',
    tollPlazaAddress: '4QHW+FFP, Kota, Rajasthan 325003, India',
    craneNumber: 7023264417,
    ambulanceNumber: 9929847744,
    routePatrolNumber: 7023264417,
    regionalOffice: 'RO Jaipur',
    nearestPoliceStationName: 'R.K. Puram Police Station Kota',
    nearestPoliceStationPHN: '07442350768',
    nearestHospital:'Medical College Kota',
    emergencyNumber: 1033
  },
{
    highwayNumber: 'NH-27',
    TollPlazaName : 'hanging bridge Kota Rajasthan India Toll Plaza',
    tollPlazaAddress: '5Q4G+FPC, NH 27, Kota, Rajasthan 323021, India',
    craneNumber: 7023264417,
    ambulanceNumber: 7023230723,
    routePatrolNumber: 7023264417,
    regionalOffice: 'RO Jaipur',
    nearestPoliceStationName: 'R.K. Puram Police Station Kota',
    nearestPoliceStationPHN: '0744235077',
    nearestHospital:'Medical College Kota',
    emergencyNumber: 1033
  },
{
    highwayNumber: 'NH-148N',
    TollPlazaName : 'Toll Plaza Lalsot highway',
    tollPlazaAddress: 'Riico Toll Booth, Lalsot - Kota Mega Hwy, Gamach, Rajasthan 323803',
    craneNumber: 7023264417,
    ambulanceNumber: 7023230723,
    routePatrolNumber: 7023264417,
    regionalOffice: 'RO Jaipur',
    nearestPoliceStationName: 'R.K. Puram Police Station Kota',
    nearestPoliceStationPHN: '0744235077',
    nearestHospital:'Medical College Kota',
    emergencyNumber: 1033
  }, 
{
    highwayNumber: 'NH-148N',
    TollPlazaName : 'Tollway National HIghwya of India',
    tollPlazaAddress: '6WRW+6VV, Kota Bypass, Deolimachhiy, Rajasthan 324002',
    craneNumber: 7023264417,
    ambulanceNumber: 7023230723,
    routePatrolNumber: 7023264417,
    regionalOffice: 'RO Jaipur',
    nearestPoliceStationName: 'R.K. Puram Police Station Kota',
    nearestPoliceStationPHN: '0744235077',
    nearestHospital:'Medical College Kota',
    emergencyNumber: 1033
  },
];
  
export const insertHighwaysData = () => {
  highways.forEach(highway => {
    insertHighway({
      highwayNumber: highway.highwayNumber,
      TollPlazaName :highway.TollPlazaName,
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
