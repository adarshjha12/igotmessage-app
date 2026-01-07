import { createClient } from "redis";

const client = createClient({
    username: 'default',
    password: '80xtFq48aPehjw83bIGIPZQtaqV7ndbz',
    socket: {
        host: 'redis-16139.c264.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 16139
    }
});

client.on("error", (err) => console.log("Redis Client Error", err));
client.on("connect", () => console.log("Redis Client Connected"));

export default client;
