export const cardProducts = [
  {
    id: "amex-gold",
    issuer: "American Express",
    network: "American Express",
    name: "American Express Gold Card",
    annualFee: 325
  },
  {
    id: "chase-sapphire-preferred",
    issuer: "Chase",
    network: "Visa",
    name: "Chase Sapphire Preferred",
    annualFee: 95
  },
  {
    id: "chase-sapphire-reserve",
    issuer: "Chase",
    network: "Visa",
    name: "Chase Sapphire Reserve",
    annualFee: 550
  },
  {
    id: "capital-one-venture-x",
    issuer: "Capital One",
    network: "Visa",
    name: "Capital One Venture X",
    annualFee: 395
  }
];

export const benefitRules = [
  {
    id: "amex-gold-dining-monthly",
    cardProductId: "amex-gold",
    name: "Dining Credit",
    periodType: "monthly",
    limitAmount: 10,
    merchantMatchers: ["grubhub", "cheesecake factory", "goldbelly", "wine.com", "five guys"],
    categoryMatchers: ["FOOD_AND_DRINK"],
    requiresEnrollment: false
  },
  {
    id: "amex-gold-uber-monthly",
    cardProductId: "amex-gold",
    name: "Uber Cash",
    periodType: "monthly",
    limitAmount: 10,
    merchantMatchers: ["uber", "uber eats"],
    categoryMatchers: ["TRANSPORTATION", "FOOD_AND_DRINK"],
    requiresEnrollment: true
  },
  {
    id: "chase-sapphire-reserve-travel-annual",
    cardProductId: "chase-sapphire-reserve",
    name: "Travel Credit",
    periodType: "annual",
    limitAmount: 300,
    merchantMatchers: ["delta", "united", "american airlines", "southwest", "hilton", "marriott", "hyatt"],
    categoryMatchers: ["TRAVEL"],
    requiresEnrollment: false
  },
  {
    id: "capital-one-venture-x-travel-annual",
    cardProductId: "capital-one-venture-x",
    name: "Travel Portal Credit",
    periodType: "annual",
    limitAmount: 300,
    merchantMatchers: ["capital one travel"],
    categoryMatchers: ["TRAVEL"],
    requiresEnrollment: false
  }
];

export function cardProductById(id) {
  return cardProducts.find((cardProduct) => cardProduct.id === id);
}

