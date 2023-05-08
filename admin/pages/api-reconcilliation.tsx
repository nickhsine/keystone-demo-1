import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Heading } from '@keystone-ui/core';
import useSWR from 'swr'
import { AppResponse, AppResults, AppOffer, Promotion, PromotionData, PromoCategory, PromoSplitDetails, TableProps } from '../interfaces/reconcilliation';
import ApiTable from '../components/api-table';
import { ApiArray } from '../interfaces/reconcilliation';
const bubbleOffersUrl = 'http://localhost:3030/app-offers';
const networkBOffers = 'http://localhost:3030/promotions';

const fetcher = (url:string) => fetch(url).then(r => r.json())


export default function BubblePromotions() {
    return (
        <>
            <PageContainer header={<Heading type="h3">API Reconcilliation</Heading>}>
                <ApiDisplay></ApiDisplay>
            </PageContainer>
        </>
    )
}

function ApiDisplay() {

    const {data: bubbleData, error: bubbleError, isLoading: bubbleIsLoading} = callAPI<AppResponse>(bubbleOffersUrl)
    const {data: nbData, error: nBError, isLoading: nBIsLoading} = callAPI<Promotion[]>(networkBOffers)

    const dataArr = getArrData(bubbleData, nbData)


    return (
        <>
        <ErrorOrLoading
            error = {bubbleError || nBError}
            isLoading = {bubbleIsLoading || nBIsLoading}
            isResponseData = {bubbleData || nbData}
        />
        {dataArr && <ApiTable tableProps={dataArr}></ApiTable>}
        </>
    )
}

const getArrData = (bubbleData: AppResponse | null | undefined, nbData:  Promotion[] | null | undefined) => {
    if (!bubbleData || !nbData) {
        return null;
    }
    const dataArr: ApiArray[] = []

    bubbleData.response.results.map((offer, i: number) =>
        dataArr.push({"Name": offer.name_text, "Discount": offer.discount_percentage_number ? offer.discount_percentage_number.toString()+"%" : "£"+offer.discount_amount_number, "Expires": offer.expiry_date_date.split('T')[0], Source: "Bubble", Match: null }),
    )
    nbData.map((set, j) => 
        {
            set["promo-data"].map((promo, i: number) => {
                let promoExpiry: string = promo['expiry-date']
                promo['splits-details'].map((split) => 
                dataArr.push({"Name": promo.name, "Discount": split['gross-commission'].replace("&pound;", "£"), "Expires": promoExpiry, Source: "Network B", Match:null }),
                )
            })
        }
    )
    return (
        dataArr
    );

}
const callAPI = <T,>(target: string) => {
    const { data, error, isLoading} = useSWR<T>(target, fetcher)
    
    return (
        {data, error, isLoading}
    )
}

const ErrorOrLoading = (error: any, isLoading: boolean, isResponseData: boolean) => {
    if (error[0] != undefined) return (
        <div>Error</div>
    )
    if (isLoading == true) return (
        <div>Loading...</div>
    )
    if (isResponseData == false) return (
        <div>Failed to load</div>
    )
    return (
        null
    )
}
