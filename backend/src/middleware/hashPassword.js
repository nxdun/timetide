const bcrypt = require('bcryptjs');

async function hashPassword(req, res, next) {
    try {
        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = hashPassword;