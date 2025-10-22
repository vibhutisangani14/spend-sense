import { type ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  process.env.NODE_ENV !== "production" &&
    console.error(`\x1b[31m${err.stack}\x1b[0m`);

  if (err instanceof Error) {
    if (err.cause) {
      const cause = err.cause as { status: number };
      res.status(cause.status).json({ message: err.message });
    } else {
      res.status(500).json({ message: err.message });
    }
    return;
  }
  res.status(500).json({ message: "Internal server error" });
};

export default errorHandler;
