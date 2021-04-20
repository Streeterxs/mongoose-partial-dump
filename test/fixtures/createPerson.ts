import Person, { IPerson, IPersonDocument } from '../models/PersonModel';

export const createPerson = async (
    args: IPerson = {
        name: 'mock-person-name',
    }
): Promise<IPersonDocument> => {
    const { name, ...properties } = args;

    return await new Person({ name, ...properties }).save();
};

export const getOrCreatePerson = async (): Promise<IPersonDocument> => {
    const personFinded = await Person.findOne();

    if (!personFinded) {
        const newPerson = await createPerson();
        return newPerson;
    }

    return personFinded;
};
