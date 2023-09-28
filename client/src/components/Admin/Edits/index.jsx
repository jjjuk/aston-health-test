import { DataGridPro } from '@mui/x-data-grid-pro'

import useGet from '../../../hooks/useGet'

import Sheet from '@mui/joy/Sheet'
import JsonCodeBlock from '../../JsonCodeBlock'

const restPath = '/edit'

export default function Edits() {
  const { data, isLoading } = useGet(restPath)

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      editable: false,
    },
    {
      field: 'User',
      headerName: 'Пользователь',
      width: 280,
      editable: false,
      valueGetter: ({ value }) => value.email,
    },
    {
      field: 'model',
      headerName: 'Url',
      width: 280,
      editable: false,
    },
    {
      field: 'operation',
      headerName: 'Method',
      width: 80,
      editable: false,
    },
    {
      field: 'date',
      headerName: 'Время',
      type: 'dateTime',
      width: 160,
      valueGetter: ({ value }) => new Date(value),
      editable: false,
    },
  ]

  if (isLoading) return <>Lodaing...</>

  return (
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
        rows={data?.length ? data : []}
        sx={{
          backgroundColor: 'background.paper',
        }}
        columns={columns}
        editMode="row"
        rowHeight={38}
        getDetailPanelContent={({ row }) => (
          <JsonCodeBlock json={row.arguments} />
        )}
        getDetailPanelHeight={() => 'auto'}
        autoPageSize
      />
    </Sheet>
  )
}
