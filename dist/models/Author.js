"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Author = void 0;
class Author {
    constructor(name, email, phone, bio) {
        this.name = name,
            this.email = email,
            this.phone = phone,
            this.bio = bio;
    }
    toObject() {
        return {
            name: this.name,
            email: this.email,
            phone: this.phone,
            bio: this.bio
        };
    }
}
exports.Author = Author;
