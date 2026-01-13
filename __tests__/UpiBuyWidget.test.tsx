/* eslint-env jest */
import React from 'react'
import { render, screen } from '@testing-library/react'
import UpiBuyWidget from '../components/UpiBuyWidget'
import { ToastProvider } from '../components/ToastContext'

// qrcode.react uses a canvas which isn't implemented in jsdom; mock it.
jest.mock('qrcode.react', () => {
  const React = require('react')
  const QR = ({ value, size }: { value?: string; size?: number }) =>
    React.createElement('div', { 'data-testid': 'qrcode-mock', style: { width: size, height: size } }, String(value || ''))
  return { __esModule: true, default: QR, QRCodeSVG: QR }
})

test('renders upi widget and shows order id', () => {
  render(React.createElement(ToastProvider, null, React.createElement(UpiBuyWidget, { amount: 199 })))
  const orders = screen.getAllByText(/Order/i)
  expect(orders.length).toBeGreaterThan(0)
})
