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
import { useContext, useEffect, useMemo, useState } from 'react'
import { getAddressSuggestions } from '../../../../utils/suggestions'
import fuzzySearch from '../../../../utils/fuzzy'
import { objectDiff } from '../../../../utils/diff'
import { EditContactInfoContext } from '../context'

const filterOptions = (options, { inputValue }) =>
  fuzzySearch(options, ['value', 'unrestricted_value'], inputValue)

function EditContactInfoForm({ patientId, onSubmit, contactInfo = undefined }) {
  const restPath = useMemo(
    () => `/patient/${patientId}/contact-info`,
    [patientId]
  )

  const [query, setQuery] = useState(
    contactInfo?.address ? contactInfo.address : ''
  )
  const [options, setOptions] = useState([
    { value: contactInfo?.address ? contactInfo.address : '' },
  ])

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
            let data = Object.fromEntries(
              Array.from(formData.entries()).filter((e) => !!e[1])
            )
            const detailedData = options.find(
              (e) => e.value === data.address
            )?.data

            if (detailedData) {
              data.fedDist = detailedData.federal_district
              data.region = detailedData.region
              data.area = detailedData.area
              data.city = detailedData.city
              data.settlement = detailedData.settlement
            }

            data.region = rest[!contactInfo ? 'post' : 'patch'](
              restPath,
              !contactInfo ? data : objectDiff(data, contactInfo)
            )
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
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              getOptionLabel={(option) => option.value || ''}
              onInputChange={handleQueryChange}
              placeholder={
                contactInfo?.address || 'Адрес проживания пациента...'
              }
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

export default function EditContactInfo({ onSubmit }) {
  const { editContactInfo } = useContext(EditContactInfoContext)

  return (
    <EditContactInfoForm
      onSubmit={onSubmit}
      patientId={editContactInfo.patientId}
      contactInfo={editContactInfo.contactInfo || undefined}
    />
  )
}
