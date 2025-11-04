import { createClient } from "redis";

const client = createClient({
  username: "default",
  password: "8PNSPyC9NH6jUtjhAmeE6vcLgmkBEv2m",
  socket: {
    host: "redis-12655.crce206.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 12655,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));
client.on("connect", () => console.log("Redis Client Connected"));

export default client;
