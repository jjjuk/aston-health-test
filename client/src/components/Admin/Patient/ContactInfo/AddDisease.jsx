import Stack from '@mui/joy/Stack'
import Input from '@mui/joy/Input'
import Sheet from '@mui/joy/Sheet'
import Button from '@mui/joy/Button'
import ModalClose from '@mui/joy/ModalClose'
import Typography from '@mui/joy/Typography'
import { isArray } from 'lodash'
import rest, { catchRestError } from '../../../../utils/rest'
import Autocomplete from '@mui/joy/Autocomplete'
import AutocompleteOption from '@mui/joy/AutocompleteOption'
import ListItemDecorator from '@mui/joy/ListItemDecorator'
import Add from '@mui/icons-material/Add'

import { mutate } from 'swr'
import { useContext, useEffect, useState } from 'react'
import fuzzySearch from '../../../../utils/fuzzy'
import { AddDiseaseContext } from '../context'

const filterOptions = (options, { inputValue }) =>
  fuzzySearch(options, ['name'], inputValue)

const getOptions = async () => {
  const res = await rest.get('patient/count-by?disease=true')
  return isArray(res.data) ? res.data.filter((el) => el.name) : []
}

const restPath = '/disease'

export default function AddDisease({ onSubmit }) {
  const { addDisease } = useContext(AddDiseaseContext)

  const [options, setOptions] = useState([])

  useEffect(() => {
    getOptions().then(setOptions)
  }, [setOptions])

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
        <Typography level="h4">Заболевание</Typography>

        <form
          style={{ width: '100%' }}
          onSubmit={(event) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            let form = Object.fromEntries(formData.entries())
            form.patientId = addDisease.patientId
            form.diagnosedAt = new Date(form.diagnosedAt)
            rest
              .post(restPath, form)
              .then(() => {
                mutate(restPath)
                onSubmit()
              })
              .catch(catchRestError)
          }}
        >
          <Stack spacing={2}>
            <Autocomplete
              required
              name="name"
              options={options}
              type="text"
              isOptionEqualToValue={(option, value) =>
                option.name === value.value
              }
              getOptionLabel={(option) => option.name || ''}
              placeholder={'Заболевание'}
              filterOptions={(options, params) => {
                const filtered = filterOptions(options, params)
                const { inputValue } = params
                // Suggest the creation of a new value
                const isExisting = options.some(
                  (option) => inputValue === option.title
                )
                if (inputValue !== '' && !isExisting) {
                  filtered.push({
                    name: inputValue,
                    title: `Добавить "${inputValue}"`,
                  })
                }

                return filtered
              }}
              renderOption={(props, option) => (
                <AutocompleteOption {...props}>
                  {option.title?.startsWith('Добавить "') && (
                    <ListItemDecorator>
                      <Add />
                    </ListItemDecorator>
                  )}

                  {option.title || option.name}
                </AutocompleteOption>
              )}
            />
            <Input
              required
              name="diagnosedAt"
              type="date"
              placeholder="Дата пост. диаг."
            />
            <Button type="submit">Добавить</Button>
          </Stack>
        </form>
      </Stack>
    </Sheet>
  )
}
