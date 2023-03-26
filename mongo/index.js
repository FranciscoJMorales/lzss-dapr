import { DaprServer } from '@dapr/dapr';
import { connect } from './database.js';
import { Text } from './text.model.js';

const DAPR_HOST = process.env.DAPR_HOST || "http://localhost";
const DAPR_HTTP_PORT = process.env.DAPR_HTTP_PORT || "3502";
const SERVER_HOST = process.env.SERVER_HOST || "127.0.0.1";
const SERVER_PORT = process.env.APP_PORT || 5003;
const PUBSUB_NAME = "compressionpubsub";
const PUBSUB_DATABASE = 'mongo';

async function main() {
  //Connect to local mongodb
  await connect();

  const server = new DaprServer(SERVER_HOST, SERVER_PORT, DAPR_HOST, DAPR_HTTP_PORT);

  // Save text and compression to database
  server.pubsub.subscribe(PUBSUB_NAME, PUBSUB_DATABASE, async (data) => {
    console.log("Text received: " + data);
    const result = await Text.create(data);
    console.log(result);
    return;
  });
}

main().catch(e => console.error(e));
