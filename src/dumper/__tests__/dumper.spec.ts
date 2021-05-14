import { dumper } from '../dumper';

import { databaseTestModule } from '../../../test/database/memoryDatabase';

import Dog from '../../../test/models/DogModel';
import PetShop from '../../../test/models/PetShopModel';
import Person from '../../../test/models/PersonModel';
import DogOwner from '../../../test/models/DogOwnerModel';

import { createDog } from '../../../test/fixtures/createDog';
import { createPerson } from '../../../test/fixtures/createPerson';
import { createDogOwner } from '../../../test/fixtures/createDogOwner';
import { createPetShop } from '../../../test/fixtures/createPetShop';
import { createPetShopClient } from '../../../test/fixtures/createPetShopClient';

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

it('show copy values for a dog and a petshop by dog id', async () => {
   const dog = await new Dog({ name: 'Blackie' }).save();
   await new PetShop({ name: 'Local Peties', dogs: [dog._id] }).save();

   const dupGenerated = await dumper({
      collectionName: 'Dog',
      collectionObjectId: dog._id,
   });

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

it('show copy values for a Dog, DogOwner and PetShopClient', async () => {
   const dog = await createDog({ name: 'Blackie' });
   const person = await createPerson({ name: 'Charlinhos' });
   const dogOwner = await createDogOwner({ dog: dog._id, person: person._id });
   const petShop = await createPetShop({ dogs: [dog._id] });
   const petShopClient = await createPetShopClient({
      petShop: petShop._id,
      dogOwner: dogOwner._id,
   });

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

   expect(dupGenerated['PetShopClient']).toHaveLength(1);
   expect(dupGenerated['PetShopClient'][0]._id).toEqual(petShopClient._id);
   expect(dupGenerated['PetShopClient'][0].petShop).toEqual(petShop._id);
   expect(dupGenerated['PetShopClient'][0].dogOwner).toEqual(dogOwner._id);
});

it('show copy values for a Dog, DogOwner and PetShopClient with dog id', async () => {
   const dog = await createDog({ name: 'Blackie' });
   const person = await createPerson({ name: 'Charlinhos' });
   const dogOwner = await createDogOwner({ dog: dog._id, person: person._id });
   const petShop = await createPetShop({ dogs: [dog._id] });
   const petShopClient = await createPetShopClient({
      petShop: petShop._id,
      dogOwner: dogOwner._id,
   });

   const dupGenerated = await dumper({
      collectionName: 'Dog',
      collectionObjectId: dog._id,
   });
   expect(dupGenerated['Dog']).toHaveLength(1);
   expect(dupGenerated['Dog'][0].name).toEqual('Blackie');

   expect(dupGenerated['DogOwner']).toHaveLength(1);
   expect(dupGenerated['DogOwner'][0].person).toEqual(person._id);
   expect(dupGenerated['DogOwner'][0].dog).toEqual(dog._id);

   expect(dupGenerated['PetShopClient']).toHaveLength(1);
   expect(dupGenerated['PetShopClient'][0]._id).toEqual(petShopClient._id);
   expect(dupGenerated['PetShopClient'][0].petShop).toEqual(petShop._id);
   expect(dupGenerated['PetShopClient'][0].dogOwner).toEqual(dogOwner._id);
});

it('should dump direct ref documents [dog, dogowner and person]', async () => {
   const dog = await createDog({ name: 'Blackie' });
   const person = await createPerson({ name: 'Charlinhos' });
   await createDogOwner({ dog: dog._id, person: person._id });

   const dupGenerated = await dumper({
      collectionName: 'Dog',
      collectionObjectId: dog._id,
   });
   expect(dupGenerated['Dog']).toHaveLength(1);
   expect(dupGenerated['Dog'][0].name).toEqual('Blackie');

   expect(dupGenerated['DogOwner']).toHaveLength(1);
   expect(dupGenerated['DogOwner'][0].person).toEqual(person._id);
   expect(dupGenerated['DogOwner'][0].dog).toEqual(dog._id);

   expect(dupGenerated['Person']).toHaveLength(1);
   expect(dupGenerated['Person'][0]._id).toEqual(person._id);
   expect(dupGenerated['Person'][0].name).toEqual('Charlinhos');
});

it('should dump direct ref documents [dog, dogowner, person, petShopCliend and petShop]', async () => {
   const dog = await createDog({ name: 'Blackie' });
   const person = await createPerson({ name: 'Charlinhos' });
   const dogOwner = await createDogOwner({ dog: dog._id, person: person._id });
   const petShop = await createPetShop({ dogs: [dog._id] });
   const petShopClient = await createPetShopClient({
      petShop: petShop._id,
      dogOwner: dogOwner._id,
   });

   console.log('petShop: ', petShop);
   const dupGenerated = await dumper({
      collectionName: 'Dog',
      collectionObjectId: dog._id,
   });
   expect(dupGenerated['Dog']).toHaveLength(1);
   expect(dupGenerated['Dog'][0].name).toEqual('Blackie');

   expect(dupGenerated['DogOwner']).toHaveLength(1);
   expect(dupGenerated['DogOwner'][0].person).toEqual(person._id);
   expect(dupGenerated['DogOwner'][0].dog).toEqual(dog._id);

   expect(dupGenerated['Person']).toHaveLength(1);
   expect(dupGenerated['Person'][0]._id).toEqual(person._id);
   expect(dupGenerated['Person'][0].name).toEqual('Charlinhos');

   expect(dupGenerated['PetShopClient']).toHaveLength(1);
   expect(dupGenerated['PetShopClient'][0]._id).toEqual(petShopClient._id);
   expect(dupGenerated['PetShopClient'][0].petShop).toEqual(petShop._id);
   expect(dupGenerated['PetShopClient'][0].dogOwner).toEqual(dogOwner._id);

   expect(dupGenerated['PetShop']).toHaveLength(1);
   expect(dupGenerated['PetShop'][0]._id).toEqual(petShop._id);
});

// TODO fix array ref types dump
it.skip('should dump ref path petshop with path type array populated', async () => {
   const dog = await createDog({ name: 'Blackie' });
   const person = await createPerson({ name: 'Charlinhos' });
   const dogOwner = await createDogOwner({ dog: dog._id, person: person._id });
   const petShop = await createPetShop({ dogs: [dog._id] });
   const petShopClient = await createPetShopClient({
      petShop: petShop._id,
      dogOwner: dogOwner._id,
   });

   console.log('petShop: ', petShop);
   const dupGenerated = await dumper({
      collectionName: 'Dog',
      collectionObjectId: dog._id,
   });

   expect(dupGenerated['PetShop']).toHaveLength(1);
   expect(dupGenerated['PetShop'][0]._id).toEqual(petShop._id);
   expect(dupGenerated['PetShop'][0].dogs).toEqual([dog._id]);
});
