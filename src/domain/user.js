"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var node_crypto_1 = require("node:crypto");
var bcrypt_1 = require("bcrypt");
var User = /** @class */ (function () {
    function User(_a, autoHashPassword) {
        var id = _a.id, name = _a.name, email = _a.email, password = _a.password, role = _a.role, token = _a.token;
        if (autoHashPassword === void 0) { autoHashPassword = true; }
        this.id = id || (0, node_crypto_1.randomUUID)();
        this.name = name;
        this.email = email;
        this.password = autoHashPassword ? (0, bcrypt_1.hashSync)(password, 8) : password;
        this.role = role;
        this.token = token || null;
    }
    return User;
}());
exports.User = User;
