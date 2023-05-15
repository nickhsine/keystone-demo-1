import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Heading } from '@keystone-ui/core';
import useSWR from 'swr'
import { AppResponse, AppResults, AppOffer, Promotion, PromotionData, PromoCategory, PromoSplitDetails, TableProps, ApiArray, ApiArrayItem } from '../interfaces/reconcilliation';
import ApiTable from '../components/api-table';

const bubbleOffersUrl = process.env.CARMA_APP_OFFERS_API_URL ?? '';
const networkBOffersUrl = process.env.NETWORKB_PROMOTIONS_API_URL ?? '';
const bubbleOffersToken = process.env.CARMA_APP_API_BEARER_TOKEN ?? '';
const networkBOffersToken = process.env.NETWORKB_API_BEARER_TOKEN ?? '';


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

    const {data: bubbleData, error: bubbleError, isLoading: bubbleIsLoading} = callAPI<AppResponse>(bubbleOffersUrl, bubbleOffersToken)
    const {data: nbData, error: nBError, isLoading: nBIsLoading} = callAPI<Promotion[]>(networkBOffersUrl, networkBOffersToken)

    const combinedArray = getArrData(bubbleData, nbData)


    return (
        <>
        <ErrorOrLoading
            error = {bubbleError || nBError}
            isLoading = {bubbleIsLoading || nBIsLoading}
            isResponseData = {bubbleData || nbData}
        />
        {combinedArray && <ApiTable tableProps={combinedArray.dataArr}></ApiTable>}
        {/* {combinedArray && <ApiTable tableProps={combinedArray.singleArr}></ApiTable>} */}
        </>
    )
}

const getArrData = (bubbleData: AppResponse | null | undefined, nbData:  Promotion[] | null | undefined) => {
    if (!bubbleData || !nbData) {
        return null;
    }
    const dataArr: ApiArray[] = []
    const singleArr: ApiArray[] = []

    bubbleData.response.results.map((offer, i: number) => 
        dataArr.push({Id: offer.nimda_id_number, items: [{"Name": offer.name_text, "Discount": offer.discount_percentage_number ? offer.discount_percentage_number.toFixed(2)+"%" : "£"+offer.discount_amount_number, "Expires": offer.expiry_date_date.split('T')[0], Source: "Bubble"} ]}),
    )
    nbData.map((set, j) => 
        set["promo-data"].map((promo, i: number) => {
            let promoExpiry: string = promo['expiry-date']
            dataArr.forEach((entry, i) => {
                if(promo['promo-id'] == entry.Id){
                    // console.log("matches: "+promo['promo-id']+" = "+entry.Id)
                    promo['splits-details'].map((split) => 
                        dataArr[i].items.splice(i, 0, {"Name": promo.name, "Discount": split['gross-commission'].replace("&pound;", "£"), "Expires": promoExpiry, Source: "Network B" }),
                    )
                    
                } 
                else {
                    promo['splits-details'].map((split) => 
                        singleArr.push({"Id": promo['promo-id'], items: [{"Name": promo.name, "Discount": split['gross-commission'].replace("&pound;", "£"), "Expires": promoExpiry, Source: "Network B"}] }),
                    )
                }
                })
        })
    )
    console.log(singleArr)
    return (
        {dataArr}
    );

}
const callAPI = <T,>(target: string, token: string) => {
    const { data, error, isLoading} = useSWR<T>([target, token], fetcher)
    // console.log([target, token])
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
