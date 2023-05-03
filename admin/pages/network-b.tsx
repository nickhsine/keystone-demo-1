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

interface Promotions {
    "promotions": Promotion[]
}

interface Promotion {
    "total-categories": number,
    "partner-name": string,
    "categories-list": PromotionCategory[]
}

interface PromotionCategory {
    "category-id": number,
    "category-name": string,
    "featured": string,
    "sort-order": number,
    "subcategory": string
}

function ApiDisplay() {
    const { data: responsData, error, isLoading } = useSWR<Promotion[] | null>(promsUrl, fetcher)
    if (error) return <div>failed to load</div>
    if (isLoading) return <div>loading...</div>
    if (!responsData) {
        return  <div>failed to load</div>;
    }

    // render data
    let parsedData = responsData.map(set => 
        <ul>
            {set["categories-list"].map((partner: PromotionCategory, i: number) =>
                <li key={partner['category-id']}>
                    {partner['category-name']}
                    <ul>
                        <li>{partner['category-id']}</li>
                        <li>{partner.featured}</li>
                    </ul>
                </li>
            )}
        </ul>
    );
    return (
            <>
                {parsedData}
            </>
        )
}
