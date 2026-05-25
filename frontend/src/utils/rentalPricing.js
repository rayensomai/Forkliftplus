export function countRentalDays(startDate, endDate) {
  const start = new Date(`${startDate}T12:00:00`)
  const end = new Date(`${endDate}T12:00:00`)
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24))
  return diff + 1
}

export function getTaxRate(region) {
  const code = (region || '').toUpperCase()
  if (code === 'QC' || code === 'PQ' || code === 'QUEBEC') return 0.14975
  return 0.13
}

export function calculateRentalPricing(machine, startDate, endDate, options = {}) {
  const { deliveryRequired = true, region = 'QC' } = options
  const days = countRentalDays(startDate, endDate)

  if (!machine || !startDate || !endDate || days < 1) {
    return null
  }

  let rentalCost
  let rateLabel

  if (days >= 28) {
    const periods = Math.ceil(days / 28)
    rentalCost = periods * machine.monthly_rate
    rateLabel = 'monthly'
  } else if (days >= 7) {
    const periods = Math.ceil(days / 7)
    rentalCost = periods * machine.weekly_rate
    rateLabel = 'weekly'
  } else {
    rentalCost = days * machine.daily_rate
    rateLabel = 'daily'
  }

  const deliveryFee = deliveryRequired ? machine.delivery_fee : 0
  const subtotal = rentalCost + deliveryFee
  const taxes = Math.round(subtotal * getTaxRate(region) * 100) / 100
  const deposit = machine.deposit
  const totalDue = Math.round((subtotal + taxes + deposit) * 100) / 100

  return {
    days,
    rentalCost: Math.round(rentalCost * 100) / 100,
    deliveryFee: Math.round(deliveryFee * 100) / 100,
    deposit,
    taxes,
    subtotal: Math.round(subtotal * 100) / 100,
    totalDue,
    rateLabel,
  }
}

export function formatMoney(amount, locale = 'fr-CA') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10)
}

export function addDaysIsoDate(isoDate, days) {
  const date = new Date(`${isoDate}T12:00:00`)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}
