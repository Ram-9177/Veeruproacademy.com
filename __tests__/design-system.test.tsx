import React from 'react'
import { render } from '@testing-library/react'
import { Section } from '@/app/components/Section'
import { Card } from '@/app/components/Card'
import { FeatureCard } from '@/app/components/FeatureCard'

describe('Design system components', () => {
  it('renders Section (default) and subtle variants', () => {
    const { container, rerender } = render(<Section><div>Content</div></Section>)
    expect(container.firstChild).toMatchSnapshot()
    rerender(<Section variant="subtle"><div>Content</div></Section>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders Card variants consistently', () => {
    const { container, rerender } = render(<Card title="Title" description="Desc">Child</Card>)
    expect(container.firstChild).toMatchSnapshot()
    rerender(<Card variant="elevated" title="Title" description="Desc">Child</Card>)
    expect(container.firstChild).toMatchSnapshot()
    rerender(<Card variant="glass" title="Title" description="Desc">Child</Card>)
    expect(container.firstChild).toMatchSnapshot()
    rerender(<Card variant="minimal" title="Title" description="Desc">Child</Card>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders FeatureCard without gradient variant', () => {
    const { container } = render(
      <FeatureCard icon={<span>*</span>} title="Feat" description="Desc" />
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
