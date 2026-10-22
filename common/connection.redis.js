
const { createClient } = require("redis");

const client = createClient({
    url:"rediss://default:gQAAAAAAAprKAAIgcDE5MzE5NTRjODA3M2E0MDNkYTg5ODZjMmY5MjVhZWMzMA@stable-finch-170698.upstash.io:6379",
});


async function connectionDB() {
    try {
        await client.connect();
        console.log("Redis Connected Successfully...... 😎");
    } catch (error) {
        console.log("Redis Connected Failed...... 😥😥");
    }
}

module.exports = { connectionDB, client };