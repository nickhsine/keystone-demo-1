import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Heading } from '@keystone-ui/core';
import useSWR from 'swr'
import { AppResponse, AppResults, AppOffer, Promotion, PromotionData, PromoCategory, PromoSplitDetails, TableProps, ApiArray, ApiArrayItem } from '../interfaces/reconcilliation';
import ApiTable from '../components/api-table';

const bubbleOffersUrl = process.env.NEXT_PUBLIC_CARMA_APP_OFFERS_API_URL ?? 'i do not exist';
const bubbleOffersToken = process.env.NEXT_PUBLIC_CARMA_APP_API_BEARER_TOKEN ?? '';
const networkBOffersUrl = "http://localhost:3030/promotions" ?? '';
const networkBOffersToken = process.env.NEXT_PUBLIC_NETWORKB_BEARER_TOKEN ?? '';



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

    const bubbleData = callAPI(bubbleOffersUrl, bubbleOffersToken, "GET")
    console.log(bubbleData)
    //REVERT AFTER
    const nbData = callAPI(networkBOffersUrl, networkBOffersToken, "GET")

    const combinedArray = getArrData(bubbleData, nbData)

    return (
        <>
        <p>DISPLAY</p>
            {combinedArray && <ApiTable tableProps={combinedArray.dataArr}></ApiTable>}
            {/* {combinedArray && <ApiTable tableProps={combinedArray.singleArr}></ApiTable>} */}
        </>
    )
}

const getArrData = (bubbleData: AppResponse | void | undefined, nbData:  Promotion[] | void | undefined) => {
    if (!bubbleData || !nbData) {
        console.log("no data")
        return null;
    }
    const dataArr: ApiArray[] = []
    const singleArr: ApiArray[] = []
    console.log(bubbleData)
    bubbleData.response.results.map((offer, i: number) => 
        dataArr.push({Id: offer.nimda_id_number, items: [{"Name": offer.name_text, "Discount": offer.discount_percentage_number ? offer.discount_percentage_number.toFixed(2)+"%" : "£"+offer.discount_amount_number, "Expires": offer.expiry_date_date.split('T')[0], Source: "Bubble"} ]}),
    )
    nbData.map((set, j) => 
        set["promo-data"].map((promo, i: number) => {
            let promoExpiry: string = promo['expiry-date']
            dataArr.forEach((entry, i) => {
                if(promo['promo-id'] == entry.Id){
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
    console.log(dataArr)
    return (
        {dataArr}
    );

}
const callAPI = (target: string, token: string, method: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);

    const requestOptions: RequestInit = {
        method: method,
        headers: myHeaders,
        redirect: 'follow',
    };

    fetch(target, requestOptions)
    .then(response => response.json())
    .then(result => {
        return (
            console.log(result)
        )
    })
    .catch(error => {
        return (
            error
        )
    })
}
