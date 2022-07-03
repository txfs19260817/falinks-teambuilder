import { MongoClient } from 'mongodb';

/* eslint-disable */
function newMongoClientPromise() {
  const uri = process.env.MONGODB_URI;
  const options = {};

  let client;

  if (!uri) {
    throw new Error("Please add your Mongo URI to .env(.local)");
  }

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    // @ts-ignore
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      // @ts-ignore
      global._mongoClientPromise = client.connect();
    }
    // @ts-ignore
    return global._mongoClientPromise;
  }
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  return client.connect();
}

const clientPromise = newMongoClientPromise();

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
