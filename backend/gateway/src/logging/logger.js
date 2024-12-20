const logger = (req, res, next) => {
    const originalSend = res.send;
    // Intercept the res.send method
    res.send = function (body) {
        // Log request details
        console.log(`[${new Date().toISOString()}] ${req.method} ${res.statusCode} ${req.url}`);
        // Call the original res.send method
        return originalSend.call(this, body);
    };

    next();
};

module.exports = logger;