import { isAllowedLocale } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'

const AUTHNET_API_LOGIN_ID = process.env.AUTHNET_API_LOGIN_ID
const AUTHNET_TRANSACTION_KEY = process.env.AUTHNET_TRANSACTION_KEY
const AUTHNET_RETURN_URL = process.env.SITE_URL
const AUTHNET_ENDPOINT = 'https://api.authorize.net/xml/v1/request.api'

function validateAmount(amount: unknown): number | null {
  const num = Number(amount)
  if (isNaN(num) || num <= 0 || num > 9999999) {
    return null
  }
  return Math.round(num * 100) / 100
}

export async function POST(request: NextRequest) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { lang, amount } = body as { lang: string; amount: string }

  if (!isAllowedLocale(lang)) {
    console.warn('Suspicious request with invalid lang:', {
      lang,
      ip: request.headers.get('x-forwarded-for'),
    })
    return NextResponse.json({ error: 'Invalid language parameter' }, { status: 400 })
  }

  const validAmount = validateAmount(amount)
  if (validAmount === null) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  if (!AUTHNET_API_LOGIN_ID || !AUTHNET_TRANSACTION_KEY) {
    console.error('Missing Authorize.Net credentials')
    return NextResponse.json({ error: 'Payment service not configured' }, { status: 500 })
  }

  const hostedPaymentReturnOptions = {
    showReceipt: true,
    url: `${AUTHNET_RETURN_URL}/${lang}/thank-you`,
    urlText: 'Continue',
    cancelUrl: `${AUTHNET_RETURN_URL}/${lang}/give`,
    cancelUrlText: 'Cancel',
  }

  const requestPayload = {
    getHostedPaymentPageRequest: {
      merchantAuthentication: {
        name: AUTHNET_API_LOGIN_ID,
        transactionKey: AUTHNET_TRANSACTION_KEY,
      },
      transactionRequest: {
        transactionType: 'authCaptureTransaction',
        amount: validAmount.toFixed(2),
      },
      hostedPaymentSettings: {
        setting: [
          {
            settingName: 'hostedPaymentReturnOptions',
            settingValue: JSON.stringify(hostedPaymentReturnOptions),
          },
          {
            settingName: 'hostedPaymentButtonOptions',
            settingValue: JSON.stringify({ text: 'Donate' }),
          },
          {
            settingName: 'hostedPaymentStyleOptions',
            settingValue: JSON.stringify({ bgColor: 'blue' }),
          },
          {
            settingName: 'hostedPaymentPaymentOptions',
            settingValue: JSON.stringify({
              cardCodeRequired: true,
              showCreditCard: true,
              showBankAccount: true,
            }),
          },
          {
            settingName: 'hostedPaymentSecurityOptions',
            settingValue: JSON.stringify({ captcha: true }),
          },
          {
            settingName: 'hostedPaymentShippingAddressOptions',
            settingValue: JSON.stringify({ show: false, required: false }),
          },
          {
            settingName: 'hostedPaymentBillingAddressOptions',
            settingValue: JSON.stringify({ show: true, required: false }),
          },
          {
            settingName: 'hostedPaymentCustomerOptions',
            settingValue: JSON.stringify({
              showEmail: false,
              requiredEmail: false,
            }),
          },
          {
            settingName: 'hostedPaymentOrderOptions',
            settingValue: JSON.stringify({ show: false }),
          },
        ],
      },
    },
  }

  try {
    const response = await fetch(AUTHNET_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestPayload),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    interface AuthNetResponse {
      messages?: {
        resultCode?: string
        message?: Array<{ text?: string }>
      }
      token?: string
    }

    const result = (await response.json()) as AuthNetResponse

    if (result.messages?.resultCode === 'Ok' && result.token) {
      return NextResponse.json({ token: result.token })
    } else {
      const errorMessage = result.messages?.message?.[0]?.text || 'Payment token request failed'
      console.error('Authorize.Net error:', errorMessage)
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }
  } catch (error) {
    console.error('Payment token request error:', error)
    return NextResponse.json(
      { error: 'Failed to communicate with payment service' },
      { status: 500 },
    )
  }
}
