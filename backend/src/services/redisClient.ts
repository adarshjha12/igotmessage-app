import { createClient } from "redis";

const client = createClient({
    username: 'default',
    password: 'C2SHq1qBjRPF2cXs9mRqnHgWNUvy1SdJ',
    socket: {
        host: 'redis-15113.c212.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 15113
    }
});

client.on("error", (err) => console.log("Redis Client Error", err));
client.on("connect", () => console.log("Redis Client Connected"));

export default client;
