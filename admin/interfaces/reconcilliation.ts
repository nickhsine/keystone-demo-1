export interface Promotion {
    "total-promos": number,
    "partner-name": string,
    "promo-data": PromotionData[]
}

export interface PromotionData {
    "promo-id": number,
    "logo": string,
    "brand-id": number,
    "name": string,
    "title": string,
    "cashback-percentage": number,
    "start-date": string,
    "expiry-date": string,
    "update-date": string,
    "on-going-promo": string,
    "commission-rates": string,
    "categories": PromoCategory[],
    "splits-details": PromoSplitDetails[]
}

export interface PromoCategory {
    "category-id": number,
    "category-name": string
}

export interface PromoSplitDetails {
    "gross-commission":string,
}

export interface AppResponse {
    response: AppResults
}

export interface AppResults {
    results: AppOffer[]
}

export interface AppOffer {
    name_text: string,
    discount_percentage_number: number | null,
    discount_amount_number: number | null,
    expiry_date_date: string
}

export interface ApiArray {
    Name: string | null,
    Discount: string | null,
    Expires: string | null,
    Source: string | null
    Match: boolean| null
}[]

export interface TableProps {
    tableProps: ApiArray[]
  }