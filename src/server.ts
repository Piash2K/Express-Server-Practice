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
  await pool.query(`
            CREATE TABLE IF NOT EXISTS information(
            id SERIAL PRIMARY KEY,
            student_id INT REFERENCES students(id) ON DELETE CASCADE,
            class VARCHAR(20) NOT NULL,
            roll VARCHAR(10) NOT NULL,
            completed_study BOOLEAN DEFAULT false,
            due_date DATE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `);
};
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello From Express Server Practice");
});

app.post("/students", async (req: Request, res: Response) => {
  const { name, email, age } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO students(name,email,age) VALUES($1, $2, $3) RETURNING *`,
      [name, email, age]
    );
    res.status(200).json({
      success: true,
      message: "Successfully posted to DB",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/students", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM students`);
    res.status(200).json({
      success: true,
      message: "All students fetched successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
