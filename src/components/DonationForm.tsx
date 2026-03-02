'use client'

import React, { useState, FormEvent } from 'react'

interface PaymentResponse {
  token?: string
  error?: string
}

interface DonationFormProps {
  lang: string
}

export function DonationForm({ lang }: DonationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState('')
  const [amountInput, setAmountInput] = useState('10.00')
  const [amount, setAmount] = useState(10.0)

  const processPayment = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/get-payment-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang, amount }),
      })

      const data = (await response.json()) as PaymentResponse

      if (!response.ok || !data.token) {
        throw new Error(data.error || 'Unable to obtain a valid payment token from the server.')
      }

      setToken(data.token)

      // Submit the form after token is set
      setTimeout(() => {
        const form = document.getElementById('donationForm') as HTMLFormElement
        if (form) form.submit()
      }, 100)
    } catch (error) {
      console.error('Payment preparation failed:', error)
      const errorMsg =
        error instanceof Error
          ? error.message
          : 'Payment preparation failed, please try again later or contact support.'
      alert(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const onAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value || ''

    // remove invalid chars, allow only digits and dot
    v = v.replace(/[^0-9.]/g, '')

    // keep only first dot and limit decimals to 2
    const parts = v.split('.')
    if (parts.length > 1) {
      const intPart = parts.shift() || '0'
      const decPart = parts.join('').slice(0, 2)
      v = `${intPart}.${decPart}`
    }

    // normalize leading dot
    if (v.startsWith('.')) v = '0' + v

    // avoid multiple leading zeros like "00"
    if (/^0[0-9]/.test(v)) v = String(parseInt(v, 10))

    setAmountInput(v)
    setAmount(parseFloat(v || '0') || 0)
  }

  const onAmountBlur = () => {
    // ensure two decimals on blur
    const n = parseFloat(amountInput || '0') || 0
    const finalAmount = Math.round(n * 100) / 100
    setAmount(finalAmount)
    setAmountInput(finalAmount.toFixed(2))
  }

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold">Make a Donation</h2>
      <form id="donationForm" onSubmit={processPayment}>
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium text-gray-700">
            Amount ($)
          </label>
          <input
            type="text"
            id="amount"
            value={amountInput}
            onChange={onAmountInput}
            onBlur={onAmountBlur}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="10.00"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || amount <= 0}
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isLoading ? 'Processing...' : 'Donate Now'}
        </button>

        {token && <input type="hidden" name="token" value={token} />}
      </form>
    </div>
  )
}
