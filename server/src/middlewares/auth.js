// Mock Authentication Middleware (For Hackathon Speed)
// In a real app, this would verify a JWT token.
// Here, we simulate a logged-in user by passing their details in the headers.

const authMiddleware = (req, res, next) => {
    const userId = req.headers['user-id'];
    const userRole = req.headers['user-role'];

    // If headers are missing, block the request
    if (!userId || !userRole) {
        res.status(401); // Unauthorized
        return next(new Error("Not Authorized: Missing 'user-id' or 'user-role' headers"));
    }

    // Attach the mock user to the request object so our routes can access it
    req.user = {
        id: userId,
        role: userRole
    };

    next();
};

// Role-Based Authorization
// Blocks access if the user's role is not in the allowed list
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403); // Forbidden
            return next(new Error("Forbidden: You do not have permission to perform this action"));
        }
        next();
    };
};

module.exports = { authMiddleware, restrictTo };
