import { Types } from 'mongoose';

export type CliDump = {
   collectionName: string;
   id?: Types.ObjectId;
   log?: boolean;
};
