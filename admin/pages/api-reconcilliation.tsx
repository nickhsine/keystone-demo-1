import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Heading } from '@keystone-ui/core';
import useSWR from 'swr'
import { AppResponse, AppResults, AppOffer } from '../interfaces/app-offers';
import { Promotion, PromotionData, PromoCategory, PromoSplitDetails } from '../interfaces/nb-promotions';
import ApiTable from '../components/api-table';
const bubbleOffersUrl = 'http://localhost:3030/app-offers';
const networkBOffers = 'http://localhost:3030/promotions';

const fetcher = (url:string) => fetch(url).then(r => r.json())
let dataArr: DataArray[] = []

interface DataArray {
    Name: string,
    Percentage: string,
    Expires: string
}

export default function BubblePromotions() {
    return (
        <>
            <PageContainer header={<Heading type="h3">Bubble App</Heading>}>
                <h1>Promotions</h1>
                <ApiTable tableProps={dataArr}></ApiTable>
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
    // render data
    const processBubble = bubbleData.response.results.map((offer, i: number) =>
        dataArr.push({"Name": offer.name_text, "Percentage": offer.discount_percentage_number?.toString(), "Expires": offer.expiry_date_date}),
    )
    if (nBError) return (<div>failed to load</div>)
    if (nBIsLoading) return (<div>loading...</div>)
    if (!nbData) {
        return (<div>failed to load</div>)
    }
    // render data
    const processNetworkB = nbData.map((set, j) => 
        {
            set["promo-data"].map((promo, i: number) => {
                let promoExpiry: string = promo['expiry-date']
                promo['splits-details'].map((split) => 
                dataArr.push({"Name": promo.name, "Percentage": split['gross-commission'], "Expires": promoExpiry}),
                )
            })
        }
    )
        console.log(dataArr);
    return (
            <>
                <p>Test</p>
                {/* {dataArr} */}
            </>
        )
}
