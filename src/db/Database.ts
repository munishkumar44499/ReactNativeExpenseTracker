import SQLite from "react-native-sqlite-storage";

SQLite.enablePromise(true);

export const getDBConnection = async () => {
  return SQLite.openDatabase({ name: "expenses.db", location: "default" });
};

export const createTable = async (db: SQLite.SQLiteDatabase) => {
  const query = `CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      amount REAL NOT NULL
    );`;
  await db.executeSql(query);
};

export const addExpense = async (db: SQLite.SQLiteDatabase, category: string, amount: number) => {
  const insertQuery = `INSERT INTO expenses (category, amount) VALUES (?, ?)`;
  await db.executeSql(insertQuery, [category, amount]);
};

export const getExpenses = async (db: SQLite.SQLiteDatabase) => {
  const results = await db.executeSql("SELECT * FROM expenses");
  let expenses: { id: number; category: string; amount: number }[] = [];
  results.forEach(result => {
    for (let i = 0; i < result.rows.length; i++) {
      expenses.push(result.rows.item(i));
    }
  });
  return expenses;
};

export const clearTable = async (db: SQLite.SQLiteDatabase) => {
  await db.executeSql("DELETE FROM expenses");
};
