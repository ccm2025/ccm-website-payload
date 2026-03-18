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
  } catch (error) {
    console.error('[get-payment-token] Failed to parse request body', error)
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { locale, amount } = body as { locale: string; amount: string }

  if (!isAllowedLocale(locale)) {
    console.warn('Suspicious request with invalid locale:', {
      locale,
      ip: request.headers.get('x-forwarded-for'),
    })
    return NextResponse.json({ error: 'Invalid language parameter' }, { status: 400 })
  }

  const validAmount = validateAmount(amount)
  if (validAmount === null) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  if (!AUTHNET_API_LOGIN_ID || !AUTHNET_TRANSACTION_KEY) {
    console.error('[get-payment-token] Missing Authorize.Net credentials', {
      hasLoginId: !!AUTHNET_API_LOGIN_ID,
      hasTransactionKey: !!AUTHNET_TRANSACTION_KEY,
      hasSiteUrl: !!AUTHNET_RETURN_URL,
      env: Object.keys(process.env).filter((k) => k.includes('AUTH') || k.includes('SITE')),
    })
    return NextResponse.json(
      { error: 'Payment service not configured. Please contact support.' },
      { status: 500 },
    )
  }

  if (!AUTHNET_RETURN_URL) {
    console.error('[get-payment-token] Missing SITE_URL environment variable')
    return NextResponse.json(
      { error: 'Payment return URL not configured. Please contact support.' },
      { status: 500 },
    )
  }

  const hostedPaymentReturnOptions = {
    showReceipt: true,
    url: `${AUTHNET_RETURN_URL}/${locale}/thank-you`,
    urlText: 'Continue',
    cancelUrl: `${AUTHNET_RETURN_URL}/${locale}/give`,
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
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

    const response = await fetch(AUTHNET_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestPayload),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[get-payment-token] HTTP error from Authorize.Net', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText.slice(0, 500),
      })
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    interface AuthNetResponse {
      messages?: {
        resultCode?: string
        message?: Array<{ text?: string }>
      }
      token?: string
    }

    // Parse response with BOM cleaning
    const rawText = await response.text()
    const cleanText = rawText.replace(/^\ufeff/, '') // Remove UTF-8 BOM
    let result: AuthNetResponse
    try {
      result = JSON.parse(cleanText)
    } catch (parseError) {
      console.error('[get-payment-token] JSON parse error after BOM cleanup', {
        errorMessage: parseError instanceof Error ? parseError.message : String(parseError),
        rawLength: rawText.length,
        first100chars: rawText.slice(0, 100),
      })
      throw parseError
    }

    if (result.messages?.resultCode === 'Ok' && result.token) {
      return NextResponse.json({ token: result.token })
    } else {
      const errorMessage = result.messages?.message?.[0]?.text || 'Payment token request failed'
      console.error('[get-payment-token] Authorize.Net error', {
        resultCode: result.messages?.resultCode,
        errorMessage,
        fullResponse: JSON.stringify(result).slice(0, 500),
      })
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }
  } catch (error) {
    const isAborted = error instanceof DOMException && error.name === 'AbortError'
    const isTimeout = isAborted && error.message.includes('abort')

    console.error('[get-payment-token] Request failed', {
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      isTimeout,
      isAborted,
      stack: error instanceof Error ? error.stack?.slice(0, 500) : undefined,
    })

    const userMessage = isTimeout
      ? 'Payment service is taking too long. Please try again.'
      : 'Failed to communicate with payment service. Please try again later.'

    return NextResponse.json({ error: userMessage }, { status: 500 })
  }
}
