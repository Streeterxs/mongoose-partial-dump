import { dumper } from '../dumper';

import { databaseTestModule } from '../../../test/database/memoryDatabase';

import Dog from '../__fixtures__/DogModel';
import PetShop from '../__fixtures__/PetShopModel';
import Person from '../__fixtures__/PersonModel';
import DogOwner from '../__fixtures__/DogOwnerModel';

const { connect, clearDatabase, closeDatabase } = databaseTestModule();

beforeAll(() => connect());

afterEach(() => clearDatabase());

afterAll(() => closeDatabase());

it('show copy values for a dog and a petshop', async () => {
    const dog = await new Dog({ name: 'Blackie' }).save();
    await new PetShop({ name: 'Local Peties', dogs: [dog._id] }).save();

    const getPayload = (collectionName: string) => {
        switch (collectionName) {
            case 'Dog':
                return {
                    _id: dog._id,
                };
            case 'PetShop':
                return {
                    dogs: { $in: [dog._id] },
                };

            default:
                return {
                    dog: dog._id,
                };
        }
    };

    const dupGenerated = await dumper({ collectionName: 'Dog', getPayload });

    expect(dupGenerated['Dog']).toHaveLength(1);
    expect(dupGenerated['Dog'][0].name).toEqual('Blackie');

    expect(dupGenerated['PetShop']).toHaveLength(1);
    expect(dupGenerated['PetShop'][0].name).toEqual('Local Peties');
    expect(dupGenerated['PetShop'][0].dogs).toEqual([dog._id]);
});

it('show copy values based on dog model, bring all petshop related', async () => {
    const blackie = await new Dog({ name: 'Blackie' }).save();
    const whitie = await new Dog({ name: 'Whitie' }).save();

    await new PetShop({ name: 'Local Peties 1', dogs: [blackie._id] }).save();
    await new PetShop({
        name: 'Local Peties 2',
        dogs: [blackie._id, whitie._id],
    }).save();
    await new PetShop({ name: 'Local Peties 2', dogs: [whitie._id] }).save();

    const getPayload = (collectionName: string) => {
        switch (collectionName) {
            case 'Dog':
                return {
                    _id: blackie._id,
                };
            case 'PetShop':
                return {
                    dogs: { $in: [blackie._id] },
                };

            default:
                return {
                    dog: blackie._id,
                };
        }
    };

    const dupGenerated = await dumper({ collectionName: 'Dog', getPayload });

    expect(dupGenerated['Dog']).toHaveLength(1);
    expect(dupGenerated['Dog'][0].name).toEqual('Blackie');

    expect(dupGenerated['PetShop']).toHaveLength(2);
    expect(dupGenerated['PetShop'][0].name).toEqual('Local Peties 1');
    expect(dupGenerated['PetShop'][0].dogs).toEqual([blackie._id]);

    expect(dupGenerated['PetShop'][1].name).toEqual('Local Peties 2');
    expect(dupGenerated['PetShop'][1].dogs).toEqual([blackie._id, whitie._id]);
});

it('show copy values for a Dog and a DogOwner', async () => {
    const dog = await new Dog({ name: 'Blackie' }).save();
    const person = await new Person({ name: 'Charlinhos' }).save();
    await new DogOwner({ person: person._id, dog: dog._id }).save();

    const getPayload = (collectionName: string) => {
        switch (collectionName) {
            case 'Dog':
                return {
                    _id: dog._id,
                };
            case 'PetShop':
                return {
                    dogs: { $in: [dog._id] },
                };

            default:
                return {
                    dog: dog._id,
                };
        }
    };

    const dupGenerated = await dumper({ collectionName: 'Dog', getPayload });

    expect(dupGenerated['Dog']).toHaveLength(1);
    expect(dupGenerated['Dog'][0].name).toEqual('Blackie');

    expect(dupGenerated['DogOwner']).toHaveLength(1);
    expect(dupGenerated['DogOwner'][0].person).toEqual(person._id);
    expect(dupGenerated['DogOwner'][0].dog).toEqual(dog._id);
});
