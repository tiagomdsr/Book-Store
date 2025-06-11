"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publisher = void 0;
class Publisher {
    constructor(name, address, phone) {
        this.name = name;
        this.address = address;
        this.phone = phone;
    }
    toObject() {
        return {
            name: this.name,
            address: this.address,
            phone: this.phone
        };
    }
}
exports.Publisher = Publisher;
