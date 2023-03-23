import { DaprClient } from '@dapr/dapr';
import express from 'express';
import bodyParser from 'body-parser';

const DAPR_HOST = process.env.DAPR_HOST || "http://localhost";
const DAPR_HTTP_PORT = process.env.DAPR_HTTP_PORT || "3500";
const PUBSUB_NAME = "orderpubsub";
const PUBSUB_TOPIC = "orders";
const PUBSUB_TOPIC2 = "orders2";

async function main() {
  const app = express()
  const port = 3000
  
  app.use(bodyParser.json());
  
  const client = new DaprClient(DAPR_HOST, DAPR_HTTP_PORT);

  app.post('/compress', async (req, res) => {
    const text = req.body.text;
    console.log("Text received: " + text)
    const compressed = await client.pubsub.publish(PUBSUB_NAME, PUBSUB_TOPIC, text);
    res.status(200).json(compressed)
  })
  
  app.post('/decompress', async (req, res) => {
    const text = req.body.text;
    console.log("Compressed text received: " + text)
    const decompressed = await client.pubsub.publish(PUBSUB_NAME, PUBSUB_TOPIC2, text);
    res.status(200).json(decompressed)
  })
  
  app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })
}

main().catch(e => console.error(e))
