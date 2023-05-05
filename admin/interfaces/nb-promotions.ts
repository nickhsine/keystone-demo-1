export interface Promotion {
    "total-promos": number,
    "partner-name": string,
    "promo-data": PromotionData[]
}

export interface PromotionData {
    "promo-id": number,
    "sort-order": number,
    "type": string,
    "medium": string,
    "supplier": string,
    "logo": string,
    "promo-background": string,
    "promo-details-background": string,
    "promo-background-category": string,
    "promo-details-background-category": string,
    "offer-activated-text": string,
    "offer-activated-url": string,
    "offer-activated-url-networkattribution": string,
    "brand-id": number,
    "name": string,
    "featured-brand": "No",
    "payment-issuer-mid": number,
    "brand-description": string,
    "title": string,
    "cashback-percentage": number,
    "cashback-pound": null,
    "description": string,
    "start-date": string,
    "expiry-date": string,
    "update-date": string,
    "on-going-promo": string,
    "commission-rates": string,
    "categories": PromoCategory[],
    "terms": string,
    "splits-details": PromoSplitDetails[]
}

export interface PromoCategory {
    "category-id": number,
    "category-name": string
}

export interface PromoSplitDetails {
    "commission-group-number": number,
    "gross-commission":string,
    "networkb-share": string,
    "commission-available": string,
    "carma-share": string,
    "gross-user-share": string,
    "trees-cashback": string,
    "user-cashback": string,
}