import React from 'react'
import { render } from '@testing-library/react'
import { CodeExample } from '@/components/CodeExample'

describe('CodeExample', () => {
  it('renders code and copy/paste buttons', () => {
    const { getByLabelText, container } = render(<CodeExample code={'console.log("hi")'} language="javascript" runnable />)
    expect(getByLabelText('Copy code')).toBeInTheDocument()
    expect(getByLabelText('Paste code')).toBeInTheDocument()
    expect(getByLabelText('Run code')).toBeInTheDocument()
    expect(container.firstChild).toMatchSnapshot()
  })
})
