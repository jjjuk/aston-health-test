import { useCallback, useEffect, useState } from 'react'
import Modal from '@mui/joy/Modal'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Close'
import {
  GridRowModes,
  DataGridPro,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid-pro'
import { randomId } from '@mui/x-data-grid-generator'
import useGet from '../../../hooks/useGet'
import rest, { catchRestError } from '../../../utils/rest'
import { mutate } from 'swr'
import ContactInfo from './ContactInfo'
import Sheet from '@mui/joy/Sheet'
import { objectDiff } from '../../../utils/diff'
import { omit } from 'lodash'
import { produce } from 'immer'
import EditContactInfo from './ContactInfo/EditContactInfo'
import {
  AddAnalysisContext,
  AddDiseaseContext,
  EditContactInfoContext,
  initialAddAnalysis,
  initialAddDisease,
  initialContactInfo,
} from './context'
import AddDisease from './ContactInfo/AddDisease'
import AddAnalysis from './ContactInfo/AddAnalysis'

const restPath = '/patient'

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props

  const handleClick = () => {
    const id = `create_${randomId()}`
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        name: '',
        surname: '',
        patronymic: '',
        gender: '',
        ageOnRegistration: '',
        code: '',
        isNew: true,
      },
    ])
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }))
  }

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Добавить запись
      </Button>
    </GridToolbarContainer>
  )
}

export default function Patient() {
  const { data } = useGet(restPath)
  const [rows, setRows] = useState([])
  const [rowModesModel, setRowModesModel] = useState({})

  const [detailPanelExpandedRowIds, setDetailPanelExpandedRowIds] = useState([])

  const handleDetailPanelExpandedRowIdsChange = useCallback((newIds) => {
    setDetailPanelExpandedRowIds(
      newIds.length > 1 ? [newIds[newIds.length - 1]] : newIds
    )
  }, [])

  const [editContactInfo, setEditContactInfo] = useState(initialContactInfo)
  const [addDisease, setAddDisease] = useState(initialAddDisease)
  const [addAnalysis, setAddAnalysis] = useState(initialAddAnalysis)

  const closeEditContactInfo = useCallback(
    () =>
      setEditContactInfo(
        produce(editContactInfo, (draft) => {
          draft.open = false
        })
      ),
    [editContactInfo]
  )

  const closeAddDisease = useCallback(
    () =>
      setAddDisease(
        produce(addDisease, (draft) => {
          draft.open = false
        })
      ),
    [addDisease]
  )

  const closeAddAnalysis = useCallback(
    () =>
      setAddAnalysis(
        produce(addAnalysis, (draft) => {
          draft.open = false
        })
      ),
    [addAnalysis]
  )

  useEffect(() => {
    data && setRows(data)
  }, [data])

  const handleRowEditStop = useCallback((params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }, [])

  const handleEditClick = useCallback(
    (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
    },
    [rowModesModel]
  )
  const handleSaveClick = useCallback(
    (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
    },
    [rowModesModel]
  )
  const handleDeleteClick = useCallback(
    (id) => () => {
      rest
        .delete(restPath + `/${id}`)
        .then(() => mutate(restPath))
        .catch(catchRestError)
    },
    []
  )

  const handleCancelClick = useCallback(
    (id) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      })

      const editedRow = rows.find((row) => row.id === id)
      if (editedRow?.isNew) {
        setRows(rows.filter((row) => row.id !== id))
      }
    },
    [rowModesModel, rows]
  )

  const processRowUpdate = useCallback(
    async (newRow, oldRow) => {
      newRow.birthDate = newRow.birthDate.toISOString()
      let createdRow
      try {
        if (newRow?.isNew) {
          const res = await rest.post(
            restPath,
            omit(newRow, ['id', 'isNew', 'ageOnRegistration', 'code'])
          )
          createdRow = res.data
        } else {
          const res = await rest.patch(
            restPath + `/${newRow.id}`,
            objectDiff(newRow, oldRow)
          )
          createdRow = res.data
        }
        mutate(restPath)
        return createdRow
      } catch (err) {
        catchRestError(err)
        if (newRow?.isNew) handleCancelClick(newRow.id)()
        return oldRow
      }
    },
    [handleCancelClick]
  )

  const handleProcessRowUpdateError = useCallback(
    ({ id }) => {
      setRows(rows.filter((row) => row.id !== id))
    },
    [rows]
  )

  const handleRowModesModelChange = useCallback((newRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }, [])

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      editable: false,
      valueGetter: ({ value, row }) => (row?.isNew ? 'TBD' : value),
    },
    {
      field: 'surname',
      headerName: 'Фамилия',
      width: 120,
      editable: true,
      preProcessEditCellProps: (params) => {
        return { ...params.props, error: !params.props.value }
      },
    },
    {
      field: 'name',
      headerName: 'Имя',
      width: 120,
      editable: true,
      preProcessEditCellProps: (params) => {
        return { ...params.props, error: !params.props.value }
      },
    },
    {
      field: 'patronymic',
      headerName: 'Отчество',
      width: 120,
      editable: true,
    },
    {
      field: 'ageOnRegistration',
      headerName: 'Воз. Рег.',
      type: 'number',
      width: 80,
      align: 'left',
      headerAlign: 'left',
      editable: false,
    },
    {
      field: 'birthDate',
      headerName: 'Родился',
      type: 'date',
      width: 100,
      valueGetter: ({ value }) => new Date(value),
      editable: true,
    },
    {
      field: 'gender',
      headerName: 'Пол',
      width: 60,
      editable: true,
      type: 'singleSelect',
      valueOptions: [
        { value: 1, label: 'М' },
        { value: 2, label: 'Ж' },
      ],
    },
    { field: 'code', headerName: 'Код Пациента', width: 120, editable: false },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Действия',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={1}
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={2}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ]
        }

        return [
          <GridActionsCellItem
            key={1}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={2}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ]
      },
    },
  ]

  return (
    <EditContactInfoContext.Provider
      value={{ editContactInfo, setEditContactInfo }}
    >
      <AddDiseaseContext.Provider value={{ addDisease, setAddDisease }}>
        <AddAnalysisContext.Provider value={{ addAnalysis, setAddAnalysis }}>
          <Modal
            aria-labelledby="edit-contact-info"
            aria-describedby="edit-patient-contact-info"
            open={editContactInfo.open}
            onClose={closeEditContactInfo}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <EditContactInfo onSubmit={closeEditContactInfo} />
          </Modal>
          <Modal
            aria-labelledby="add-disease"
            aria-describedby="add disease"
            open={addDisease.open}
            onClose={closeAddDisease}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <AddDisease onSubmit={closeAddDisease} />
          </Modal>
          <Modal
            aria-labelledby="add-disease"
            aria-describedby="add disease"
            open={addAnalysis.open}
            onClose={closeAddAnalysis}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <AddAnalysis onSubmit={closeAddAnalysis} />
          </Modal>
          <Sheet
            variant="soft"
            sx={{
              height: 'calc(100vh - 86px)',
              my: 1,
              marginLeft: 'auto',
              marginRight: 'auto',
              maxWidth: 960,
              '& .actions': {
                color: 'text.secondary',
              },
              '& .textPrimary': {
                color: 'text.primary',
              },
            }}
          >
            <DataGridPro
              rows={rows}
              sx={{
                backgroundColor: 'background.paper',
              }}
              columns={columns}
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={handleProcessRowUpdateError}
              rowHeight={38}
              slots={{
                toolbar: EditToolbar,
              }}
              slotProps={{
                toolbar: { setRows, setRowModesModel },
              }}
              getDetailPanelContent={({ row }) => (
                <div style={{ paddingLeft: 48 }}>
                  <ContactInfo patientId={row.id} />
                </div>
              )}
              getDetailPanelHeight={() => 'auto'}
              detailPanelExpandedRowIds={detailPanelExpandedRowIds}
              onDetailPanelExpandedRowIdsChange={
                handleDetailPanelExpandedRowIdsChange
              }
              autoPageSize
            />
          </Sheet>
        </AddAnalysisContext.Provider>
      </AddDiseaseContext.Provider>
    </EditContactInfoContext.Provider>
  )
}
