import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('NHIGHWAYS.db');

export const showDatabaseData = () => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM Highways',
      [],
      (_, { rows }) => {
        console.log('Highways data:');
        rows._array.forEach(highway => {
          console.log(highway);
        });
      },
      error => console.error('Error fetching data from Highways table:', error)
    );
  });
};
