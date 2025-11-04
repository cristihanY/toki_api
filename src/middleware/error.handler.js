function errorHandler(err, req, res, next) {
    console.error("🔥 Error capturado:", err);

    if (err.message.includes("Unique constraint failed")) {
        return res.status(400).json({ message: "El email o el teléfono ya están en uso" });
    }

    if (err.message.includes("is required")) {
        return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: "Error interno del servidor" });
}

module.exports = errorHandler;
