const prisma = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Please provide an email and password");
    }

    // Check for user email (case-insensitive for hackathon speed)
    const user = await prisma.user.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } },
        include: {
            employee: {
                include: {
                    department: true,
                    jobPosition: true
                }
            }
        }
    });

    if (!user) {
        res.status(401);
        throw new Error("Invalid credentials. Account not found.");
    }

    // In a real app, use bcrypt.compare. For this hackathon, we use simple plaintext.
    if (user.password !== password) {
        res.status(401);
        throw new Error("Invalid email or password.");
    }

    // Format the response to match what the frontend mockAuthService previously provided
    const userPayload = {
        id: user.id,
        email: user.email,
        name: user.employee ? `${user.employee.firstName} ${user.employee.lastName}` : user.email.split('@')[0],
        role: user.role,
        avatar: user.employee ? `${user.employee.firstName[0]}${user.employee.lastName[0]}`.toUpperCase() : "U",
        department: user.employee?.department?.name || "Administration",
        title: user.employee?.jobPosition?.title || "System User",
        employeeId: user.employee?.id || null,
        loginTimestamp: new Date().toISOString(),
    };

    res.status(200).json({
        success: true,
        data: userPayload
    });
});

module.exports = { login };
