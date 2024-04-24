"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    static generateRandomString(length) {
        return new Promise((resolve, reject) => {
            const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            let randomString = "";
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                randomString += charset[randomIndex];
            }
            resolve(randomString);
        });
    }
    static objectToQueryString(obj) {
        return new Promise((resolve, reject) => {
            const queryFromObject = Object.keys(obj)
                .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
                .join("&");
            resolve(queryFromObject);
        });
    }
}
exports.default = Utils;
