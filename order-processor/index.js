import { DaprServer } from '@dapr/dapr';
import lzjs from 'lzjs';

const DAPR_HOST = process.env.DAPR_HOST || "http://localhost";
const DAPR_HTTP_PORT = process.env.DAPR_HTTP_PORT || "3501";
const SERVER_HOST = process.env.SERVER_HOST || "127.0.0.1";
const SERVER_PORT = process.env.APP_PORT || 5002;

async function main() {
  const server = new DaprServer(SERVER_HOST, SERVER_PORT, DAPR_HOST, DAPR_HTTP_PORT);

  // Dapr subscription routes orders topic to this route
  server.pubsub.subscribe("orderpubsub", "orders", (data) => {
    console.log("Text received: " + data);
    console.log(lzjs.compress(data));
    return true;
  });

  // Dapr subscription routes orders topic to this route
  server.pubsub.subscribe("orderpubsub", "orders2", (data) => {
    console.log("Compressed text received: " + data);
    console.log(lzjs.decompress(data));
    return true;
  });

  await server.start();
}

main().catch(e => console.error(e));
