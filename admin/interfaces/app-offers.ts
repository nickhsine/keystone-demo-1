export interface AppResponse {
    response: AppResults
}

export interface AppResults {
    results: AppOffer[]
}

export interface AppOffer {
    name_text: string,
    discount_percentage_number: number,
    expiry_date_date: string
}