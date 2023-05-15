import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Heading } from '@keystone-ui/core';
import useSWR from 'swr'
import { AppResponse, AppResults, AppOffer } from '../interfaces/app-offers';


const promsUrl = 'http://localhost:3030/app-offers';

const fetcher = (url:string) => fetch(url).then(r => r.json())

interface DataArray {
    Name: string,
    Percentage: number,
    Expires: string
}

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
    let dataArr: DataArray[] = []
    // render data
        responsData.response.results.map((offer, i: number) =>
                dataArr.push({"Name": offer.name_text, "Percentage": offer.discount_percentage_number, "Expires": offer.expiry_date_date}),
            // <div key={i} className="row">
            //     <div className="name">{offer.name_text}</div>
            //     <div className="gross">Gross: {offer.discount_percentage_number}</div>
            // </div>,
            ),
        responsData.response.results.map((offer, i: number) =>
                dataArr.push({"Name": offer.name_text, "Percentage": offer.discount_percentage_number, "Expires": offer.expiry_date_date}),
            // <div key={i} className="row">
            //     <div className="name">{offer.name_text}</div>
            //     <div className="gross">Gross: {offer.discount_percentage_number}</div>
            // </div>,
            ),
            console.log(dataArr)
    return (
            <>
                <p>Test</p>
                {/* {dataArr} */}
            </>
        )
}
