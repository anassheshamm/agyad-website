import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

connectDB().catch((error) => {
  console.error("MongoDB connection failed:", error.message);
});
