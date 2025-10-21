import app from "./app";
import connectDB from "./db";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", (err as Error).message);
    process.exit(1);
  }
}

start();
