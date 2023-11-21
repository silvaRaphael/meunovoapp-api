import { randomUUID } from "node:crypto";

export interface IEmail {
    id?: string;
    sender: string;
    from: string;
    to: string;
    html: string;
    sended_at?: Date;
}

export class Email {
    id: string;
    sender: string;
    from: string;
    to: string;
    html: string;
    sended_at: Date;

    constructor({ id, sender, from, to, html, sended_at }: IEmail) {
        this.id = id || randomUUID();
        this.sender = sender;
        this.from = from;
        this.to = to;
        this.html = html;
        this.sended_at = sended_at || new Date();
    }
}
