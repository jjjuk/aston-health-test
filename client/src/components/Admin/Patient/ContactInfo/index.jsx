import { Fragment, useCallback, useContext, useMemo } from 'react'
import useGet from '../../../../hooks/useGet'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import MedicalInformation from '@mui/icons-material/MedicalInformation'
import ScienceOutlined from '@mui/icons-material/ScienceOutlined'

import Stack from '@mui/joy/Stack'
import Table from '@mui/joy/Table'
import Typography from '@mui/joy/Typography'
import Edit from '@mui/icons-material/EditOutlined'
import DeleteForever from '@mui/icons-material/DeleteForeverOutlined'
import rest, { catchRestError } from '../../../../utils/rest'
import { mutate } from 'swr'
import {
  AddAnalysisContext,
  AddDiseaseContext,
  EditContactInfoContext,
} from '../context'
import { produce } from 'immer'

export default function ContactInfo({ patientId }) {
  const { editContactInfo, setEditContactInfo } = useContext(
    EditContactInfoContext
  )
  const { addAnalysis, setAddAnalysis } = useContext(AddAnalysisContext)
  const { addDisease, setAddDisease } = useContext(AddDiseaseContext)

  const restPath = useMemo(
    () => `/patient/${patientId}/contact-info`,
    [patientId]
  )
  const contactInfo = useGet(restPath)

  const openAnalysis = useCallback(
    () =>
      setAddAnalysis(
        produce(addAnalysis, (draft) => {
          draft.open = true
          draft.patientId = patientId
        })
      ),
    [addAnalysis, setAddAnalysis, patientId]
  )

  const openDisease = useCallback(
    () =>
      setAddDisease(
        produce(addDisease, (draft) => {
          draft.open = true
          draft.patientId = patientId
        })
      ),
    [addDisease, setAddDisease, patientId]
  )

  const openEdit = useCallback(
    () =>
      setEditContactInfo(
        produce(editContactInfo, (draft) => {
          draft.open = true
          draft.contactInfo = contactInfo.data || undefined
          draft.patientId = patientId
        })
      ),
    [editContactInfo, setEditContactInfo, patientId, contactInfo.data]
  )
  const handleDelete = useCallback(() => {
    rest
      .delete(restPath)
      .then(() => mutate(restPath))
      .catch(catchRestError)
  }, [restPath])

  if (contactInfo.isLoading) return <>Loading...</>

  return (
    <Fragment>
      {contactInfo.data ? (
        <Fragment>
          <Stack
            spacing={2}
            justifyContent={'flex-start'}
            alignItems={'center'}
            direction={'row'}
          >
            <Typography>Контакты</Typography>
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
            <Button
              color="primary"
              startIcon={<MedicalInformation />}
              onClick={openDisease}
            >
              Добавить Заболевание
            </Button>
            <Button
              color="primary"
              startIcon={<ScienceOutlined />}
              onClick={openAnalysis}
            >
              Добавить Анализ
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
        <Fragment>
          <Button color="primary" startIcon={<AddIcon />} onClick={openEdit}>
            Добавить контактную информацию
          </Button>
          <Button
            color="primary"
            startIcon={<MedicalInformation />}
            onClick={openDisease}
          >
            Добавить Заболевание
          </Button>
          <Button
            color="primary"
            startIcon={<ScienceOutlined />}
            onClick={openAnalysis}
          >
            Добавить Анализ
          </Button>
        </Fragment>
      )}
    </Fragment>
  )
}
