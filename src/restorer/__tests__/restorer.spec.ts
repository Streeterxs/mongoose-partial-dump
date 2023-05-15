import { databaseTestModule } from '../../../test/database/memoryDatabase';

import Dog from '../../../test/models/DogModel';
import DogOwner from '../../../test/models/DogOwnerModel';
import Person from '../../../test/models/PersonModel';

import { restore } from '../restorer';

import { dogDumpFixture } from '../__fixtures__/dogDumpFixture';
import { stringifyMocks } from '../__fixtures__/stringifyMocks';

jest.setTimeout(20000);

const { connect, clearDatabase, closeDatabase } = databaseTestModule();

beforeAll(() => connect());

afterEach(() => clearDatabase());

afterAll(() => closeDatabase());

it('should restore a dump creating documents on database', async () => {
  const dump = stringifyMocks(dogDumpFixture);

  await restore({ dump });

  const dogs = await Dog.find().lean();
  expect(dogs).toHaveLength(1);

  const [dog] = dogs;
  expect(dog.name).toBe(dogDumpFixture.Dog[0].name);
  expect(dog.__v).toBe(dogDumpFixture.Dog[0].__v);
  expect(dog._id.toString()).toBe(dogDumpFixture.Dog[0]._id.toString());

  const dogOwners = await DogOwner.find().lean();
  expect(dogOwners).toHaveLength(1);

  const [dogOwner] = dogOwners;
  expect(dogOwner.dog.toString()).toEqual(
    dogDumpFixture.DogOwner[0].dog.toString()
  );
  expect(dogOwner.person.toString()).toBe(
    dogDumpFixture.DogOwner[0].person.toString()
  );
  expect(dogOwner.__v).toBe(dogDumpFixture.DogOwner[0].__v);
  expect(dogOwner._id.toString()).toBe(
    dogDumpFixture.DogOwner[0]._id.toString()
  );

  const persons = await Person.find().lean();
  expect(persons).toHaveLength(1);

  const [person] = persons;
  expect(person.name).toBe(dogDumpFixture.Person[0].name);
  expect(person.__v).toBe(dogDumpFixture.Person[0].__v);
  expect(person._id.toString()).toBe(dogDumpFixture.Person[0]._id.toString());
});

it('should restore a dump and change values by defaultValues input', async () => {
  const dump = stringifyMocks(dogDumpFixture);

  const defaultValues = {
    name: 'Default Name',
  };
  await restore({
    dump,
    defaultValues,
  });

  const dogs = await Dog.find().lean();

  const [dog] = dogs;
  expect(dog.name).toBe(defaultValues.name);
  expect(dog.__v).toBe(dogDumpFixture.Dog[0].__v);
  expect(dog._id.toString()).toBe(dogDumpFixture.Dog[0]._id.toString());

  const persons = await Person.find().lean();

  const [person] = persons;
  expect(person.name).toBe(defaultValues.name);
  expect(person.__v).toBe(dogDumpFixture.Person[0].__v);
  expect(person._id.toString()).toBe(dogDumpFixture.Person[0]._id.toString());
});

it('should restore a dump and change values by defaultSingValues input', async () => {
  const dump = stringifyMocks(dogDumpFixture);

  const defaultSingValues = {
    Dog: {
      name: 'Default Name',
    },
  };
  await restore({
    dump,
    defaultSingValues,
  });

  const dogs = await Dog.find().lean();

  const [dog] = dogs;
  expect(dog.name).toBe(defaultSingValues['Dog'].name);
  expect(dog.__v).toBe(dogDumpFixture.Dog[0].__v);
  expect(dog._id.toString()).toBe(dogDumpFixture.Dog[0]._id.toString());

  const persons = await Person.find().lean();
  expect(persons).toHaveLength(1);

  const [person] = persons;
  expect(person.name).toBe(dogDumpFixture.Person[0].name);
  expect(person.__v).toBe(dogDumpFixture.Person[0].__v);
  expect(person._id.toString()).toBe(dogDumpFixture.Person[0]._id.toString());
});
