import { TypePublisher } from "../types";

class Publisher {
    name: string;
    address: string;
    phone: string;

    constructor(name: string, address: string, phone: string) {
        this.name = name;
        this.address = address;
        this.phone = phone;
    }

    public toObject(): TypePublisher {
        return {
            name: this.name,
            address: this.address,
            phone: this.phone
        }
    }
}

export { Publisher };