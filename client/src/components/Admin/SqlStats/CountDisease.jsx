import Grid from '@mui/joy/Grid'
import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import Stack from '@mui/joy/Stack'

import useGet from '../../../hooks/useGet'
import JsonCodeBlock from '../../JsonCodeBlock'
import { useMediaQuery } from '@mui/material'

export default function PatientCountByDisease() {
  const result = useGet('/patient/count-by?disease=true')
  const media = useMediaQuery('(min-width:1200px)')

  if (result.isLoading) return <></>

  return (
    <Grid xs={media ? 4 : 6}>
      <Sheet
        variant="outlined"
        sx={{
          maxHeight: 360,
          px: 3,
          pb: 3,
          pt: 2,
          borderRadius: 8,
        }}
      >
        <Stack spacing={2} direction={'column'}>
          <Typography> Кол-во пациентов по диагнозам</Typography>
          <JsonCodeBlock
            showLineNumbers={false}
            customStyle={{ maxHeight: 278, overflowX: 'hidden' }}
            json={result.data ? JSON.stringify(result.data) : '{}'}
          />
        </Stack>
      </Sheet>
    </Grid>
  )
}
