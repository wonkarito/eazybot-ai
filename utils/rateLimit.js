const userAccessLog = {};

const UNLIMITED_USER_ID = "215841625694404609";

module.exports = {
    allow: function(userId) {
        if (userId === UNLIMITED_USER_ID) {
            return true; // Sin restricción para el desarrollador
        }

        const now = Date.now();

        if (!userAccessLog[userId]) {
            userAccessLog[userId] = [];
        }

        // Mantener solo accesos dentro de la última hora
        userAccessLog[userId] = userAccessLog[userId].filter(ts => now - ts < 3600000);

        if (userAccessLog[userId].length >= 3) {
            return false;
        }

        userAccessLog[userId].push(now);
        return true;
    }
};
