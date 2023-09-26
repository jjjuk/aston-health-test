import { Fragment, useCallback, useMemo, useState } from 'react'
import useGet from '../../../../hooks/useGet'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import Modal from '@mui/joy/Modal'
import EditContactInfo from './EditContactInfo'
import { Stack, Table } from '@mui/joy'
import Edit from '@mui/icons-material/EditOutlined'
import DeleteForever from '@mui/icons-material/DeleteForeverOutlined'
import rest, { catchRestError } from '../../../../utils/rest'
import { mutate } from 'swr'

export default function ContactInfo({ patientId }) {
  const restPath = useMemo(
    () => `/patient/${patientId}/contact-info`,
    [patientId]
  )
  const contactInfo = useGet(restPath)

  const [edit, setEdit] = useState(false)

  const closeEdit = useCallback(() => setEdit(false), [setEdit])
  const openEdit = useCallback(() => setEdit(true), [setEdit])
  const handleDelete = useCallback(() => {
    rest
      .delete(restPath)
      .then(() => mutate(restPath))
      .catch(catchRestError)
  }, [restPath])

  if (contactInfo.isLoading) return <>Loading...</>

  return (
    <Fragment>
      <Modal
        aria-labelledby="edit-contact-info"
        aria-describedby="edit-patient-contact-info"
        open={edit}
        onClose={closeEdit}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <EditContactInfo
          patientId={patientId}
          onSubmit={closeEdit}
          contactInfo={contactInfo.data ? contactInfo.data : undefined}
        />
      </Modal>
      {contactInfo.data ? (
        <Fragment>
          <Stack spacing={2} alignItems={'flex-start'} direction={'row'}>
            <Button color="primary" startIcon={<Edit />} onClick={openEdit}>
              Редактировать
            </Button>
            <Button
              color="error"
              startIcon={<DeleteForever />}
              onClick={handleDelete}
            >
              Удалить
            </Button>
          </Stack>

          <Table
            aria-label="contact info table"
            borderAxis="bothBetween"
            variant="outlined"
            size="sm"
            // sx={{ maxWidth: 450 }}
          >
            <tbody>
              <tr>
                <th scope="row">Адрес</th>
                <td colSpan={2}>{contactInfo.data.address || '--'}</td>
              </tr>
              <tr>
                <th scope="row">Email</th>
                <td colSpan={2}>{contactInfo.data.email || '--'}</td>
              </tr>
              <tr>
                <th scope="row">Котакты</th>
                <td colSpan={2}>{contactInfo.data.phones}</td>
              </tr>
              <tr>
                <th scope="row">Контакты родств.</th>
                <td colSpan={2}>{contactInfo.data.familyPhones}</td>
              </tr>
            </tbody>
          </Table>
        </Fragment>
      ) : (
        <Button color="primary" startIcon={<AddIcon />} onClick={openEdit}>
          Добавить контактную информацию
        </Button>
      )}
    </Fragment>
  )
}
