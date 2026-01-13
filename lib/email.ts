import { env } from '@/lib/env'

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

type SendEmailOptions = {
  to: string
  subject: string
  html: string
}

export async function sendTransactionalEmail({ to, subject, html }: SendEmailOptions) {
  const apiKey = env.RESEND_API_KEY
  const from = env.RESEND_FROM_EMAIL

  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[mail:preview]', { to, subject, html })
    }
    return
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({ from, to, subject, html })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to send transactional email', errorText)
      throw new Error('Failed to send email')
    }
  } catch (error) {
    console.error('Failed to send transactional email', error)
    if (process.env.NODE_ENV !== 'production') {
      console.info('[mail:fallback-preview]', { to, subject, html })
      return
    }
    throw error
  }
}
