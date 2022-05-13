
const { validationResult } = require('express-validator')

/**
 * Check if current error is known
 */
const validator = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const [msg] = errors.array({ onlyFirstError: true });
        return res.status(400).json({ result: false, msg: msg.msg });
    }
    next();
}

module.exports = { validator }
