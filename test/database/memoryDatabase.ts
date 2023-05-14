import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const databaseTestModule = () => {
  const mongod = new MongoMemoryServer();

  /**
   * Connect to the in-memory database.
   */
  const connect = async () => {
    await mongod.start();

    // https://github.com/nodkz/mongodb-memory-server/commit/9abf04f23188e1ad4eb47b0797c33e8210b8056b#diff-45cc1c887ca9f666fee44d0273bab3652241b6bb8f8908fca5265264f3203e68R264
    // use getUri instead of deprecated getConnectionString
    const uri = await mongod.getUri();

    const mongooseOpts = {
      useNewUrlParser: true,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      useUnifiedTopology: true,
      reconnectInterval: 1000,
    };

    const connectReturn = await mongoose.connect(uri, mongooseOpts);
    console.log({ uri, connectReturn });
  };

  /**
   * Drop database, close the connection and stop mongod.
   */
  const closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  };

  /**
   * Remove all the data for all db collections.
   */
  const clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      if (key) {
        const collection = collections[key];
        await collection.deleteMany({});
      }
    }
  };

  return {
    connect,
    closeDatabase,
    clearDatabase,
  };
};
