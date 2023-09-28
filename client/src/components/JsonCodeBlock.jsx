import prettier from 'prettier/standalone.mjs'
import babel from 'prettier/plugins/babel.mjs'
import estree from 'prettier/plugins/estree.mjs'

import { useEffect, useState } from 'react'

import { CodeBlock, atomOneDark, atomOneLight } from 'react-code-blocks'
import { useLocalStorage } from '../hooks/useLocalStorage'

function JsonCodeBlock({ json, ...props }) {
  const [code, setCode] = useState('')
  const [mode] = useLocalStorage('joy-mode')

  useEffect(() => {
    ;(async () => {
      const formatted = await prettier.format(json, {
        parser: 'json',
        plugins: [babel, estree],
        // printWidth: 45,
      })
      setCode(formatted)
    })()
  }, [setCode, json])
  return (
    <CodeBlock
      {...props}
      language="json"
      text={code}
      theme={mode === 'dark' ? atomOneDark : atomOneLight}
    />
  )
}

export default JsonCodeBlock
