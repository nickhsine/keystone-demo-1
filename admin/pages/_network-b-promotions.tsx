import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Heading } from '@keystone-ui/core';
import useSWR from 'swr'
import { Promotion, PromotionData, PromoCategory, PromoSplitDetails } from '../interfaces/nb-promotions';


const promsUrl = 'http://localhost:3030/promotions';

const fetcher = (url:string) => fetch(url).then(r => r.json())

export default function NetworkBPromotions() {
    return (
        <>
            <PageContainer header={<Heading type="h3">Network B</Heading>}>
                <h1>Promotions</h1>
                <ApiDisplay></ApiDisplay>
            </PageContainer>
        </>
    )
}

function ApiDisplay() {
    const { data: responsData, error, isLoading } = useSWR<Promotion[] | null>(promsUrl, fetcher)
    if (error) return (<div>failed to load</div>)
    if (isLoading) return (<div>loading...</div>)
    if (!responsData) {
        return (<div>failed to load</div>)
    }

    // render data
    let parsedData = responsData.map((set, j) => 
        {set["promo-data"].map((promo, i: number) =>
                promo['splits-details'].map((split) => 
                    <div className="row">
                        <div className="name">{promo.name}</div>
                        <div className="gross">Gross: {split['gross-commission']}</div>
                        <div className="net-b-share">NetworkB share: {split['networkb-share']}</div>
                        <div className="commission">Commision Available: {split['commission-available']}</div>
                        <div className="carma-share">Carma Share: {split['carma-share']}</div>
                        <div className="gross-user-share">Gross User Share: {split['gross-user-share']}</div>
                        <div className="trees-cashback">Trees Cashback: {split['trees-cashback']}</div>
                        <div className="user-cashback">User Cashback: {split['user-cashback']}</div>
                    </div>
                )
            )}
    );
    return (
            <>
                {parsedData}
            </>
        )
}
