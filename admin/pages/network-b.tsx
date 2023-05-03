import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Heading } from '@keystone-ui/core';
import useSWR from 'swr'


const promsUrl = 'http://localhost:3030/promotions';

const fetcher = (url:string) => fetch(url).then(r => r.json())

export default function NetworkBPromotions() {
    return (
        <>
            <PageContainer header={<Heading type="h3">Custom Page</Heading>}>
                <h1>Test page</h1>
                <ApiDisplay></ApiDisplay>
            </PageContainer>
        </>
    )
}

interface PromotionsList {
    "promotions": Promotions[]
}

interface Promotions {
    "total-categories": number,
    "partner-name": string,
    "categories-list": PromotionCategories[]
}[]

interface PromotionCategories {
    "category-id": number,
    "category-name": string,
    "featured": string,
    "sort-order": number,
    "subcategory": string
}[]

function ApiDisplay() {
    const { data: responsData, error, isLoading } = useSWR<PromotionsList[] | null>(promsUrl, fetcher)
    if (error) return <div>failed to load</div>
    if (isLoading) return <div>loading...</div>
    let setPromotions: Promotions[] | undefined;

    // render data
    let parsedData = responsData?.map(set => 
        {setPromotions = set['promotions']},
        <ul>
            {setPromotions.map((partner: Promotions, i: number) =>
                <li key={i}>
                    {partner['partner-name']}
                    <ul>
                        {/* {
                            set['categories-list'].map((cat:PromotionCategories) =>
                                <li>{cat['category-name']}</li>
                            )
                        } */}
                    </ul>
                </li>
            )}
        </ul>
    );
    return (
            <>
                <div>hello, {parsedData ? [0]['total-categories'] : "undefined"}!</div>
                <ul>
                    {parsedData}
                </ul>
            </>
        )
}
