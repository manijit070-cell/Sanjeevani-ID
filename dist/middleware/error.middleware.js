"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    console.error('[Unhandled Error]', err);
    const status = err.status || 500;
    res.status(status).json({
        success: false,
        message: err.message || 'Internal Server Error',
        timestamp: new Date().toISOString()
    });
}
