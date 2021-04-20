import Person, { IPerson } from '../models/PersonModel';

export const createPerson = async (args?: IPerson) => {
    const { name = 'mock-person-name', ...properties } = args;

    await new Person({ name, ...properties }).save();
};

export const getOrCreatePerson = async () => {
    const personFinded = await Person.findOne();

    if (!personFinded) {
        const newPerson = await createPerson();
        return newPerson;
    }

    return personFinded;
};
