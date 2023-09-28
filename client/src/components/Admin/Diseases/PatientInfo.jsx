import Table from '@mui/joy/Table'
import Typography from '@mui/joy/Typography'
import { Fragment } from 'react'

export default function PatientInfo({ patient }) {
  return (
    <Fragment>
      <Typography>Данные Пациента</Typography>
      <Table size='sm'>
        <tbody>
          <tr>
            <th scope="row">ФИО</th>
            <td
              colSpan={2}
            >{`${patient.surname} ${patient.name} ${patient.patronymic}`}</td>
          </tr>
          <tr>
            <th scope="row">Код</th>
            <td colSpan={2}>{patient.code}</td>
          </tr>
          <tr>
            <th scope="row">Дата рождения</th>
            <td colSpan={2}>
              {new Date(patient.birthDate).toLocaleDateString('ru-RU')}
            </td>
          </tr>
          <tr>
            <th scope="row">Пол</th>
            <td colSpan={2}>{patient.gender === 1 ? 'М' : 'Ж'}</td>
          </tr>
          <tr>
            <th scope="row">Возраст регистрации</th>
            <td colSpan={2}>{patient.ageOnRegistration}</td>
          </tr>
        </tbody>
      </Table>
    </Fragment>
  )
}
