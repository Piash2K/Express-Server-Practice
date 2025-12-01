import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
const app = express();
const port = 5000;

app.use(express.json());
dotenv.config({ path: path.join(process.cwd(), ".env") });
const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`,
});

const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS students(
        id SERIAL PRIMARY KEY,
        name VARCHAR(30) NOT NULL,
        email VARCHAR(40) UNIQUE NOT NULL,
        age INT NOT NULL,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);
};
initDB();

app.get("/", (req: Request, res: Response) => {
  const result = req.body;
  res.send("Hello From Express Server Practice");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
