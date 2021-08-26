import faker from 'faker';

export enum AnonymizationType {
   name = 'name',
   phone = 'phone',
   address = 'address',
   avatar = 'avatar',
   birthdate = 'birthdate',
   creationDate = 'creationDate',
   companyName = 'companyName',
}

const anonymizeName = () => {
   return faker.name.firstName() + ' ' + faker.name.lastName();
};

const anonymizePhone = () => {
   return faker.phone.phoneNumber();
};

const anonymizeAvatar = () => {
   return faker.image.avatar();
};

const anonymizeBirthdate = () => {
   return faker.date.past();
};

const anonymizeCreationDate = () => {
   return faker.date.recent();
};

const anonymizeCompanyName = () => {
   return faker.company.companyName();
};

export const anonymize = (type: AnonymizationType) => {
   const switchAnonymization = {
      [AnonymizationType.name]: anonymizeName,
      [AnonymizationType.phone]: anonymizePhone,
      [AnonymizationType.address]: anonymizeName,
      [AnonymizationType.avatar]: anonymizeAvatar,
      [AnonymizationType.birthdate]: anonymizeBirthdate,
      [AnonymizationType.creationDate]: anonymizeCreationDate,
      [AnonymizationType.companyName]: anonymizeCompanyName,
   };

   return switchAnonymization[type]();
};
