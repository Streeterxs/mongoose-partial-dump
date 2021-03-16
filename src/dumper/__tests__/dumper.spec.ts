import { dumper } from '../dumper';

import {
    databaseTestModule
} from '../../../test/database/memoryDatabase';

import Dog from '../__fixtures__/DogModel';
import PetShop from '../__fixtures__/PetShopModel';

const {
    connect,
    clearDatabase,
    closeDatabase
} = databaseTestModule();

beforeAll(() => connect());

afterEach(() => clearDatabase());

afterAll(() => closeDatabase());

it('test', async () => {
    const dog = await new Dog({name: 'Blackie'}).save();
    await new PetShop({name: 'Local Peties', dogs: [dog._id]}).save();


  const getPayload = (collectionName: string) => {
    switch (collectionName) {
      case 'Dog':
        return {
          _id: dog._id,
        };
      case 'PetShop':
        return {
          dogs: {$in: [dog._id]},
        };

      default:
        return {
          dog: dog._id,
        };
    }
  };

    const dupGenerated = await dumper({collectionName: 'Dog', getPayload});

    expect(dupGenerated['Dog']).toHaveLength(1);
    expect(dupGenerated['Dog'][0].name).toEqual('Blackie');

    expect(dupGenerated['PetShop']).toHaveLength(1);
    expect(dupGenerated['PetShop'][0].name).toEqual('Local Peties');
    expect(dupGenerated['PetShop'][0].dogs).toEqual([dog._id]);
})