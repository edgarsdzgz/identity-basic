import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

let instance = null;

// move user/pass to .env
let mySqlConnection = mysql.createConnection({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	});

	mySqlConnection.connect( (err) => {
	if (err) throw err;
	console.log(`DB STATE: ${mySqlConnection.state}`);
});

class DbService {
	static getDbServiceInstance() {
		return instance ? instance : new DbService();
	}

	async getAllData () {
		try {
			const getAllRes = await new Promise((resolve, reject) => {
				const query = `SELECT * FROM names`
				mySqlConnection.query(query, (err, results) => {
					if (err) reject(new Error(err.message));
					resolve(results);
				})
			})
			return getAllRes;
		} catch (err) {
			console.log(err)
		}
	}

	async createName (name) {
		try {
			const dateAdded = new Date();
			const createRes = await new Promise((resolve, reject) => {
				const query = "INSERT INTO names (name) VALUES (?);"
				mySqlConnection.query(query, [name], (err, result) => {
					if (err) reject(err);
					resolve(result.insertId);
				})
			})
			return {
				id: createRes,
				name,
				created_at: dateAdded,
			};
		} catch (err){
			console.log(err)
		}
	}

	async deleteRowById(rowId) {
		const id = parseInt(rowId, 10);
		try {
			let wasDeleteSuccessful = false;
			const deleteRes = await new Promise((resolve, reject) => {
				const query = "DELETE FROM names WHERE id = ?"
				mySqlConnection.query(query, [id], (err, result) => {
					if (err) reject(err);
					resolve(result.affectedRows);
				})
			})
			deleteRes === 1 ? wasDeleteSuccessful = true : wasDeleteSuccessful = false;
			return wasDeleteSuccessful;
		} catch (err){
			console.log(err)
		}
	}

	async updateNameById(name, rowId) {
		const id = parseInt(rowId, 10);
		try {
			let wasEditSuccessful = false;
			const editRes = await new Promise((resolve, reject) => {
				const query = "UPDATE names SET name = ? WHERE id = ?"
				mySqlConnection.query(query, [name, id], (err, result) => {
					if (err) reject(err);
					resolve(result.affectedRows);
				})
			})
			editRes === 1 ? wasEditSuccessful = true : wasEditSuccessful = false;
			return wasEditSuccessful;
		} catch (err){
			console.log(err)
		}
	}

	async searchByName(name) {
		try {
			const getAllRes = await new Promise((resolve, reject) => {
				const query = `SELECT * FROM names WHERE name = ?`
				mySqlConnection.query(query, [name], (err, results) => {
					if (err) reject(new Error(err.message));
					resolve(results);
				})
			})
			return getAllRes;
		} catch (err) {
			console.log(err)
		}
	}
}

export default DbService;
