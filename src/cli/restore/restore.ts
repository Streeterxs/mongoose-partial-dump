import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

import { Configs, getConfig } from '../../configs/configMapper';
import { connectToDb } from '../../database/database';
import { modelToSchema } from '../../database/modelToSchema';

import { restoreArgvSanitize } from './restoreArgvSanitize';
import { validateRestoreCliConfig } from './restoreCliValidations';
import { restore } from '../../restorer/restorer';

const cwd = process.cwd();

export const restoreCli = async (argv: any) => {
  const sanitizedArgv = restoreArgvSanitize(argv);
  const unvalidatedConfig = await getConfig(Configs.RESTORE);

  const validatedInputs = validateRestoreCliConfig(
    sanitizedArgv,
    unvalidatedConfig
  );
  if (!validatedInputs) {
    return;
  }

  const { models, db, inputDir, defaultValues, defaultSingValues } =
    validatedInputs;

  for (const model of models) {
    const modelName = model.collection.name;
    const schema = modelToSchema(model);
    const collection = schema.get('collection');

    mongoose.model(modelName, schema, collection);
  }

  await connectToDb(db);

  const getPartialPath = () => {
    return path.join(cwd, inputDir);
  };

  const partialDumpInput = getPartialPath();

  // eslint-disable-next-line
  console.log('restoring: ', partialDumpInput);

  const dump = fs.readFileSync(partialDumpInput, 'utf8');
  await restore({ dump, defaultValues, defaultSingValues });
};
