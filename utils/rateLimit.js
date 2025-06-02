const userAccessLog = {};

module.exports = {
    allow: function(userId) {
        const now = Date.now();
        if (!userAccessLog[userId]) {
            userAccessLog[userId] = [];
        }
        // Filtrar accesos de la última hora
        userAccessLog[userId] = userAccessLog[userId].filter(ts => now - ts < 3600000);
        if (userAccessLog[userId].length >= 3) {
            return false;
        }
        userAccessLog[userId].push(now);
        return true;
    }
};