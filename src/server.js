import express from "express";
import "dotenv/config";

const app = express()
const PORT = 8383

app.listen(PORT , () => console.log(`Server hs started on: ${PORT}`))