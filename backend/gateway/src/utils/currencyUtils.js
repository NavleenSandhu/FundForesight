const countries = [
    { country: "US", currency: "USD" },
    { country: "GB", currency: "GBP" },
    { country: "ES", currency: "EUR" },
    { country: "NL", currency: "EUR" },
    { country: "FR", currency: "EUR" },
    { country: "IE", currency: "EUR" },
    { country: "CA", currency: "CAD" },
    { country: "DE", currency: "EUR" },
    { country: "IT", currency: "EUR" },
    { country: "PL", currency: "PLN" },
    { country: "DK", currency: "DKK" },
    { country: "NO", currency: "NOK" },
    { country: "SE", currency: "SEK" },
    { country: "EE", currency: "EUR" },
    { country: "LT", currency: "EUR" },
    { country: "LV", currency: "EUR" },
    { country: "PT", currency: "EUR" },
    { country: "BE", currency: "EUR" }
]

const getCurrencyByCountryCode = (countryCode) => {
    return countriesAndCurrencies[countryCode];
}

module.exports = { getCurrencyByCountryCode }