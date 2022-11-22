import { Message } from "./message-model";


export class User {
    public id: string = '';
    public name: string = '';
    public connectionId: string = '';
    public messages: Array<Message> = [];
  }