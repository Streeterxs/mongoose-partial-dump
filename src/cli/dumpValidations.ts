import { Types } from 'mongoose';

export const getValidatedDumpId = (id: string) => {
   if (!Types.ObjectId.isValid(id)) {
      return null;
   }

   return new Types.ObjectId(id);
};

export const getValidatedDumpLog = (log?: boolean) => {
   if (!(typeof log === 'boolean')) {
      return null;
   }

   return log;
};
