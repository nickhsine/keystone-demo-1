import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Heading } from '@keystone-ui/core';
import useSWR from 'swr'
import { AppResponse, AppResults, AppOffer } from '../interfaces/app-offers';


const promsUrl = 'http://localhost:3030/app-offers';

const fetcher = (url:string) => fetch(url).then(r => r.json())

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
    const { data: responsData, error, isLoading } = useSWR<AppResponse | null>(promsUrl, fetcher)
    if (error) return (<div>failed to load</div>)
    if (isLoading) return (<div>loading...</div>)
    if (!responsData) {
        return (<div>failed to load</div>)
    }
    // render data
    let parsedData = responsData.response.results.map((offer, i: number) =>
            <div key={i} className="row">
                <div className="name">{offer.name_text}</div>
                <div className="gross">Gross: {offer.discount_percentage_number}</div>
            </div>
            )
    return (
            <>
                {parsedData}
            </>
        )
}
