export const errorHandler = (err, req, res, next) => {
  console.error("Unhandled error:", err);

  const statusCode = err.statusCode || err.status || 500;
  const errors = Array.isArray(err.errors)
    ? err.errors.map((error) => error.message || error)
    : undefined;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(errors ? { errors } : {}),
  });
};
