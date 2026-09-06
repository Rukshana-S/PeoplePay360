// This wrapper catches any errors in asynchronous routes
// and automatically passes them to our global error handler middleware.
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
