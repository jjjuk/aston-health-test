import { format } from 'date-fns';

export const createPatientCode = (
  surname: string,
  name: string,
  patronymic: string,
  birthDate: Date,
) => {
  let code = surname.charAt(0);
  code += name.charAt(0);
  code += patronymic.charAt(0);
  code += format(birthDate, 'ddMMyyyy');
  return code;
};
