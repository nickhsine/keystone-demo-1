import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Heading } from '@keystone-ui/core';
import useSWR from 'swr'
import { AppResponse, AppResults, AppOffer, Promotion, PromotionData, PromoCategory, PromoSplitDetails, TableProps } from '../interfaces/reconcilliation';
import ApiTable from '../components/api-table';
import { ApiArray } from '../interfaces/reconcilliation';
const bubbleOffersUrl = 'http://localhost:3030/app-offers';
const networkBOffers = 'http://localhost:3030/promotions';

const fetcher = (url:string) => fetch(url).then(r => r.json())
const dataArr: ApiArray[] = []

export default function BubblePromotions() {
    return (
        <>
            <PageContainer header={<Heading type="h3">Bubble App</Heading>}>
                <h1>Promotions</h1>
                <ApiDisplay></ApiDisplay>
            </PageContainer>
        </>
    )
}

function ApiDisplay() {
    const { data: bubbleData, error: bubbleError, isLoading: bubbleIsLoading } = useSWR<AppResponse | null>(bubbleOffersUrl, fetcher)
    const { data: nbData, error: nBError, isLoading: nBIsLoading } = useSWR<Promotion[] | null>(networkBOffers, fetcher)

    if (bubbleError) return (<div>failed to load</div>)
    if (bubbleIsLoading) return (<div>loading...</div>)
    if (!bubbleData) {
        return (<div>failed to load</div>)
    }
    if (nBError) return (<div>failed to load</div>)
    if (nBIsLoading) return (<div>loading...</div>)
    if (!nbData) {
        return (<div>failed to load</div>)
    }
    console.log(bubbleData)
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

    // console.log(dataArr);

    return <ApiTable tableProps={dataArr}></ApiTable>
}
