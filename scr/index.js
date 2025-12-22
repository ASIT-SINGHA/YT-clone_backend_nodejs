import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express, { json } from "express"
const app = express();

import connectDB from "./db/index.js";

connectDB()
	.then(() => {
		app.listen(process.env.PORT || 8000, () => {
			console.log(`server is running at http://localhost:${process.env.PORT}`);
		});
	})
	.catch((error) => {
		console.log(`MONGODB is not connected. ${error}`);
	});
