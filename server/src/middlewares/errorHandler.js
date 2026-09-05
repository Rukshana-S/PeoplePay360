// Global Error Handler
// This catches all errors from our application and formats them into a clean JSON response
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error for the developer
    
    // If the status code is still 200, it means it's an unhandled server error (500)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        // Only show the stack trace in development mode for security
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

module.exports = errorHandler;
