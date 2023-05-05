import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Heading } from '@keystone-ui/core';
import useSWR from 'swr'


const promsUrl = 'http://localhost:3030/categories';

const fetcher = (url:string) => fetch(url).then(r => r.json())

export default function NetworkBCategories() {
    return (
        <>
            <PageContainer header={<Heading type="h3">Network B</Heading>}>
                <h1>Categories</h1>
                <ApiDisplay></ApiDisplay>
            </PageContainer>
        </>
    )
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
    if (error) return (<div>failed to load</div>)
    if (isLoading) return (<div>loading...</div>)
    if (!responsData) {
        return (<div>failed to load</div>)
    }

    // render data
    let parsedData = responsData.map((set, j) => 
        <ul key={j}>
            {set["categories-list"].map((partner: PromotionCategory, i: number) =>
                <li key={i}>
                    {i}, {partner['category-name']}
                        <p>ID: {partner['category-id']} - Featured? {partner.featured}</p>
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
