import { Matches } from 'class-validator';
import { nameRegex } from 'src/utils/regex';

export const IsValidName = () =>
  Matches(nameRegex, {
    message: function (args) {
      return `property '${args.property}' should be a valid name`;
    },
  });
