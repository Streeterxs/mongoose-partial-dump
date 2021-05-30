import mongoose from 'mongoose';

export type DatabaseConfig = {
   url: string;
};
export const connectToDb = (
   config: DatabaseConfig
): Promise<mongoose.Connection> => {
   return new Promise((resolve, reject) => {
      mongoose.Promise = global.Promise;

      mongoose.connection
         .on('error', (error) => reject(error))
         .on('close', () => console.log('Database closed'))
         .once('open', () => resolve(mongoose.connections[0]));

      mongoose.connect(config.url, {
         useNewUrlParser: true,
         useCreateIndex: true,
         useUnifiedTopology: true,
      });
   });
};
