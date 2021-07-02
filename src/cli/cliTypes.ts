import { Types } from 'mongoose';

export type CliDump = {
   collectionName: string;
   id?: Types.ObjectId;
   outputDir?: string;
   log?: boolean;
};

export type CliRestore = {
   inputDir?: string;
};
