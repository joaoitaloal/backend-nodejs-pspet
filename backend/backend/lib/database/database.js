import { messages, syncDB } from "./models.js";

export async function addMessage(message){
    await syncDB();
    await messages.create({name: message.name, message: message.message, date: message.date, time: message.time})
    .catch((e) => console.error(e));
}