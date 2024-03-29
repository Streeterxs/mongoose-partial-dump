import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const databaseTestModule = () => {
  const mongod = new MongoMemoryServer();

  /**
   * Connect to the in-memory database.
   */
  const connect = async () => {
    console.log('connect');
    await mongod.start();

    // https://github.com/nodkz/mongodb-memory-server/commit/9abf04f23188e1ad4eb47b0797c33e8210b8056b#diff-45cc1c887ca9f666fee44d0273bab3652241b6bb8f8908fca5265264f3203e68R264
    // use getUri instead of deprecated getConnectionString
    const uri = mongod.getUri();

    const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(uri, mongooseOpts);
  };

  /**
   * Drop database, close the connection and stop mongod.
   */
  const closeDatabase = async () => {
    const mongodState = mongod.state;
    if (mongodState !== 'running') {
      console.log({
        mongodState,
      });
      return;
    }

    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  };

  /**
   * Remove all the data for all db collections.
   */
  const clearDatabase = async () => {
    const mongodState = mongod.state;
    if (mongodState !== 'running') {
      console.log({
        mongodState,
      });
      return;
    }

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
    mongod,
  };
};
