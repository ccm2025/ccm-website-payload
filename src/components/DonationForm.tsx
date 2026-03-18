'use client'

import { ChangeEvent, useMemo, useState } from 'react'

interface PaymentResponse {
  token?: string
  error?: string
}

interface DonationFormProps {
  locale: string
}

export function DonationForm({ locale }: DonationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [amountInput, setAmountInput] = useState('10.00')
  const [amount, setAmount] = useState(10)

  const isZh = locale === 'zh-Hans'

  const labels = useMemo(
    () => ({
      title: isZh ? '在线捐赠' : 'Online Donation',
      amount: isZh ? '金额 (USD)' : 'Amount (USD)',
      submit: isZh ? '继续支付' : 'Continue to Payment',
      processing: isZh ? '处理中...' : 'Processing...',
      minError: isZh ? '请输入大于 0 的金额' : 'Please enter an amount greater than 0',
      genericError: isZh
        ? '支付准备失败，请稍后再试或联系同工。'
        : 'Payment preparation failed, please try again later or contact support.',
      secureMessage: isZh
        ? '你会被重定向到 Authorize.Net 安全支付页面。'
        : 'You will be redirected to a secure Authorize.Net hosted payment page.',
    }),
    [isZh],
  )

  const submitToHostedPayment = (token: string) => {
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = 'https://accept.authorize.net/payment/payment'

    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = 'token'
    input.value = token

    form.appendChild(input)
    document.body.appendChild(form)
    form.submit()
    form.remove()
  }

  const processPayment = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (amount <= 0) {
      window.alert(labels.minError)
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/get-payment-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, amount }),
      })

      const data = (await response.json()) as PaymentResponse

      if (!response.ok || !data.token) {
        throw new Error(data.error || labels.genericError)
      }

      submitToHostedPayment(data.token)
    } catch (error) {
      console.error('Payment preparation failed:', error)
      window.alert(error instanceof Error ? error.message : labels.genericError)
    } finally {
      setIsLoading(false)
    }
  }

  const onAmountInput = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value || ''

    value = value.replace(/[^0-9.]/g, '')

    const parts = value.split('.')
    if (parts.length > 1) {
      const intPart = parts.shift() || '0'
      const decPart = parts.join('').slice(0, 2)
      value = `${intPart}.${decPart}`
    }

    if (value.startsWith('.')) value = `0${value}`
    if (/^0[0-9]/.test(value)) value = String(parseInt(value, 10))

    setAmountInput(value)
    setAmount(parseFloat(value || '0') || 0)
  }

  const onAmountBlur = () => {
    const num = parseFloat(amountInput || '0') || 0
    const normalized = Math.round(num * 100) / 100
    setAmount(normalized)
    setAmountInput(normalized.toFixed(2))
  }

  return (
    <div className="rounded-lg bg-gray-50 p-6 sm:p-8">
      <h3 className="mb-4 text-xl font-bold text-[rgb(var(--website-theme-color1))] sm:text-2xl">
        {labels.title}
      </h3>

      <form onSubmit={processPayment} className="space-y-4">
        <div>
          <label htmlFor="amount" className="mb-2 block text-sm font-medium text-gray-700">
            {labels.amount}
          </label>
          <input
            id="amount"
            name="amount"
            type="text"
            inputMode="decimal"
            value={amountInput}
            onChange={onAmountInput}
            onBlur={onAmountBlur}
            placeholder="10.00"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-[rgb(var(--website-theme-color1))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--website-theme-color1))]/25"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-[rgb(var(--website-theme-color1))] px-6 py-3 text-white font-semibold transition-colors hover:bg-[rgb(var(--website-theme-color2))]"
          disabled={isLoading || amount <= 0}
        >
          {isLoading ? labels.processing : labels.submit}
        </button>

        <p className="text-xs text-gray-500">{labels.secureMessage}</p>
      </form>
    </div>
  )
}
