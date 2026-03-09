'use client'

interface DonationFormProps {
  lang: string
}

export function DonationForm({ lang }: DonationFormProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 sm:p-8">
      <h3 className="mb-4 text-xl sm:text-2xl font-bold text-[rgb(var(--website-theme-color1))]">
        Online Donation
      </h3>
      <p className="mb-6 text-gray-600">
        We&apos;re setting up our online donation system. In the meantime, please use the payment
        methods listed.
      </p>
      <div className="text-center">
        <button
          className="w-full rounded-lg bg-[rgb(var(--website-theme-color1))] px-6 py-3 text-white font-semibold transition-colors hover:bg-[rgb(var(--website-theme-color2))]"
          disabled
        >
          Coming Soon
        </button>
      </div>
    </div>
  )
}
