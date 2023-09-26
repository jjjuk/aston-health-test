import Stack from '@mui/joy/Stack'
import Input from '@mui/joy/Input'
import Sheet from '@mui/joy/Sheet'
import Button from '@mui/joy/Button'
import ModalClose from '@mui/joy/ModalClose'
import Typography from '@mui/joy/Typography'
import { isArray } from 'lodash'
import rest, { catchRestError } from '../../../../utils/rest'
import Textarea from '@mui/joy/Textarea'
import Autocomplete from '@mui/joy/Autocomplete'
import { mutate } from 'swr'
import { useEffect, useMemo, useState } from 'react'
import { getAddressSuggestions } from '../../../../utils/suggestions'
import fuzzySearch from '../../../../utils/fuzzy'

const filterOptions = (options, { inputValue }) =>
  fuzzySearch(options, ['value', 'unrestricted_value'], inputValue)

export default function EditContactInfo({
  patientId,
  onSubmit,
  contactInfo = undefined,
}) {
  const restPath = useMemo(
    () => `/patient/${patientId}/contact-info`,
    [patientId]
  )

  const [query, setQuery] = useState('')
  const [options, setOptions] = useState([{ value: '' }])

  useEffect(() => {
    query &&
      getAddressSuggestions(query).then(
        ({ data }) => isArray(data?.suggestions) && setOptions(data.suggestions)
      )
    // .catch(catchRestError)
  }, [query, setOptions])

  const handleQueryChange = (e) => {
    setQuery(e.target.value)
  }

  return (
    <Sheet
      variant="outlined"
      sx={{
        width: 460,
        px: 3,
        pb: 3,
        pt: 1,
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <ModalClose />
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Typography level="h4">Контакты</Typography>

        <form
          style={{ width: '100%' }}
          onSubmit={(event) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const data = Object.fromEntries(
              Array.from(formData.entries()).filter((e) => !!e[1])
            )
            rest[!contactInfo ? 'post' : 'patch'](restPath, data)
              .then(() => {
                mutate(restPath)
                onSubmit()
              })
              .catch(catchRestError)
          }}
        >
          <Stack spacing={2}>
            <Autocomplete
              defaultValue={contactInfo?.address || ''}
              name="address"
              options={options}
              type="text"
              // isOptionEqualToValue={(option, value) =>
              //   option.unrestricted_value === value.unrestricted_value
              // }
              getOptionLabel={(option) => option.value || ''}
              onInputChange={handleQueryChange}
              placeholder="Адрес проживания пациента..."
              filterOptions={filterOptions}
            />
            <Input
              defaultValue={contactInfo?.email || ''}
              name="email"
              type="email"
              placeholder="patient@email.com"
            />
            <Textarea
              sx={{ height: 136 }}
              defaultValue={contactInfo?.phones || ''}
              name="phones"
              type="text"
              placeholder="8-800-555-3535"
              required
            />
            <Textarea
              sx={{ height: 136 }}
              defaultValue={contactInfo?.familyPhones || ''}
              name="familyPhones"
              type="text"
              placeholder="Мария Ивановна (мать): 8-800-555-3535"
              required
            />
            <Button type="submit">Сохранить</Button>
          </Stack>
        </form>
      </Stack>
    </Sheet>
  )
}
