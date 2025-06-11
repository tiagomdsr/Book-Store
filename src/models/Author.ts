import { TypeAuthor } from "../types"

class Author {
    name: string;
    email: string;
    phone: string;
    bio: string;

    constructor (name: string, email: string, phone:string, bio: string) {
        this.name = name,
        this.email = email,
        this.phone = phone,
        this.bio = bio
    }

    public toObject(): TypeAuthor{
        return {
            name: this.name,
            email: this.email,
            phone: this.phone,
            bio: this.bio
        }
    }
}

export { Author };