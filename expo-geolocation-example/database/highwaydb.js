    import * as SQLite from 'expo-sqlite';

    const db = SQLite.openDatabase('NHighways.db');

    export const setupDatabase = () => {
    db.transaction(tx => {
        tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Highways (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            highwayNumber TEXT,
            tollPlazaAddress TEXT,
            craneNumber INTEGER,
            ambulanceNumber INTEGER,
            routePatrolNumber INTEGER,
            regionalOffice TEXT,
            nearestPoliceStationName TEXT,
            nearestPoliceStationPHN INTEGER,
            nearestHospital TEXT,
            emergencyNumber INTEGER
        );`,
        [],
        () => {
            console.log('Highways table created successfully.');
        },
        error => console.error('Error creating Highways table:', error)
        );
    });
    };

    export const insertHighway = ({
    highwayNumber,
    tollPlazaAddress,
    craneNumber,
    ambulanceNumber,
    routePatrolNumber,
    regionalOffice,
    nearestPoliceStationName,
    nearestPoliceStationPHN,
    nearestHospital,
    emergencyNumber
    }) => {
    db.transaction(tx => {
        tx.executeSql(
        'INSERT INTO Highways (highwayNumber, tollPlazaAddress, craneNumber, ambulanceNumber, routePatrolNumber, regionalOffice, nearestPoliceStationName, nearestPoliceStationPHN,nearestHospital, emergencyNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)',
        [
            highwayNumber,
            tollPlazaAddress,
            craneNumber,
            ambulanceNumber,
            routePatrolNumber,
            regionalOffice,
            nearestPoliceStationName,
            nearestPoliceStationPHN,
            nearestHospital,
            emergencyNumber
        ],
        (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
            console.log('Highway inserted successfully');
            } else {
            console.log('Failed to insert highway');
            }
        },
        error => console.error(error)
        );
    });
    };