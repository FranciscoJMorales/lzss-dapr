import { DaprServer } from '@dapr/dapr';
import { DaprClient } from '@dapr/dapr';
import lzjs from 'lzjs';

const DAPR_HOST = process.env.DAPR_HOST || "http://localhost";
const DAPR_HTTP_PORT = process.env.DAPR_HTTP_PORT || "3501";
const DAPR_HTTP_CLIENT_PORT = "3502";
const SERVER_HOST = process.env.SERVER_HOST || "127.0.0.1";
const SERVER_PORT = process.env.APP_PORT || 5002;
const PUBSUB_NAME = "compressionpubsub";
const PUBSUB_COMPRESS = "compress";
const PUBSUB_DECOMPRESS = "decompress";
const PUBSUB_DATABASE = 'mongo';

async function main() {
  const server = new DaprServer(SERVER_HOST, SERVER_PORT, DAPR_HOST, DAPR_HTTP_PORT);

  const client = new DaprClient(DAPR_HOST, DAPR_HTTP_CLIENT_PORT);

  // Dapr subscription routes orders topic to this route
  server.pubsub.subscribe(PUBSUB_NAME, PUBSUB_COMPRESS, async (data) => {
    console.log("Text received: " + data);
    const result = lzjs.compress(data);
    await client.pubsub.publish(PUBSUB_NAME, PUBSUB_DATABASE, { original: data, compressed: result });
    console.log("Compressed text: " + result);
    return;
  });

  // Dapr subscription routes orders topic to this route
  server.pubsub.subscribe(PUBSUB_NAME, PUBSUB_DECOMPRESS, async (data) => {
    console.log("Compressed text received: " + data);
    const result = lzjs.decompress(data);
    await client.pubsub.publish(PUBSUB_NAME, PUBSUB_DATABASE, { original: data, compressed: result });
    console.log("Decompressed text: " + result);
    return;
  });

  await server.start();
}

main().catch(e => console.error(e));
