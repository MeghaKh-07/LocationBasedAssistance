import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('accidents.db');

// Create table if not exists
const initDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS accidents (id INTEGER PRIMARY KEY AUTOINCREMENT, location TEXT, highwayNumber TEXT, latitude REAL, longitude REAL);`
    );
  });
};

const saveAccidentData = (location, highwayNumber, latitude, longitude) => {
  db.transaction(
    tx => {
      tx.executeSql(
        `INSERT INTO accidents (location, highwayNumber, latitude, longitude) VALUES (?, ?, ?, ?)`,
        [location, highwayNumber, latitude, longitude],
        (_, result) => {
          console.log('Accident data saved successfully');
        },
        (_, error) => {
          console.error('Error saving accident data:', error);
        }
      );
    },
    null,
    initDatabase // Ensure database is initialized before saving data
  );
};

export { initDatabase, saveAccidentData };
    