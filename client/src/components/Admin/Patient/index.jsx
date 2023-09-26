import * as React from 'react'
import Box from '@mui/material/Box'
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
  const [rows, setRows] = React.useState([])
  const [rowModesModel, setRowModesModel] = React.useState({})

  React.useEffect(() => {
    data && setRows(data)
  }, [data])

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id))
  }

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = rows.find((row) => row.id === id)
    if (editedRow?.isNew) {
      setRows(rows.filter((row) => row.id !== id))
    }
  }

  const processRowUpdate = async (newRow, oldRow) => {
    let createdRow
    try {
      if (newRow?.isNew) {
        const res = await rest.post(restPath, newRow)
        createdRow = res.data
      } else {
        const res = await rest.patch(restPath + `/${newRow.id}`, newRow)
        createdRow = res.data
      }
      mutate(restPath)
      return createdRow
    } catch (err) {
      catchRestError(err)
      if (newRow?.isNew) handleCancelClick(newRow.id)()
      return oldRow
    }
  }

  const handleProcessRowUpdateError = ({ id }) => {
    setRows(rows.filter((row) => row.id !== id))
  }

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

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
    <Box
      sx={{
        height: 'calc(100vh - 70px)',
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
        sx={{ backgroundColor: 'background.paper' }}
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
        autoPageSize
      />
    </Box>
  )
}
