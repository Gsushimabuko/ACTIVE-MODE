export interface Card {
    card_number: string,
    holder_name: string,
    expiration_year: string,
    expiration_month: string,
    cvv2: string,
    address: Address
}

interface Address {
    city: string,
    line1: string,
    line2: string,
    line3: string,
    postal_code: string,
    state: string,
    country_code: string,
}