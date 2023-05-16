import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Heading } from '@keystone-ui/core';
import { AppResponse, AppResults, AppOffer, Promotion, PromotionData, PromoCategory, PromoSplitDetails, TableProps, ApiArray, ApiArrayItem } from '../interfaces/reconcilliation';


const bubbleOffersUrl = process.env.NEXT_PUBLIC_CARMA_APP_OFFERS_API_URL ?? 'i do not exist';
const networkBOffersUrl = process.env.NEXT_PUBLIC_NETWORKB_PROMOTIONS_API_URL ?? '';
const bubbleOffersToken = process.env.NEXT_PUBLIC_CARMA_APP_API_BEARER_TOKEN ?? '';
const networkBOffersToken = process.env.NEXT_PUBLIC_NETWORKB_BEARER_TOKEN ?? '';

export default function BubblePromotions() {
const data = [];

var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer iEzrRSMyRK10uXl/vW8HJ3gE3yFEf9WkXGXHdKCgsV0=:MjAyMC0wNS0yMCAxMDoyNzozMA==:live-rg4v2vzx-trl74a-ewnnt-gzl6-moq8r2m");

var requestOptions: RequestInit = {
  method: 'POST',
  headers: myHeaders,
  redirect: 'follow',
//   mode: 'no-cors'
};

fetch("https://api.networkb.co.uk/v1/promotions", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

    

    return (
        <>
            <PageContainer header={<Heading type="h3">NB</Heading>}>
            </PageContainer>
        </>
    )
}