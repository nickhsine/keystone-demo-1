import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Heading } from '@keystone-ui/core';
import useSWR from 'swr'
import { AppResponse, AppResults, AppOffer, Promotion, PromotionData, PromoCategory, PromoSplitDetails, TableProps, ApiArray, ApiArrayItem } from '../interfaces/reconcilliation';
import ApiTable from '../components/api-table';
import { useEffect, useState } from 'react';


const bubbleOffersUrl = process.env.NEXT_PUBLIC_CARMA_APP_OFFERS_API_URL ?? 'i do not exist';
const networkBOffersUrl = "http://localhost:3030/promotions" ?? '';
const bubbleOffersToken = process.env.NEXT_PUBLIC_CARMA_APP_API_BEARER_TOKEN ?? '';
const networkBOffersToken = process.env.NEXT_PUBLIC_NETWORKB_BEARER_TOKEN ?? '';

interface ApiResponse {
    data: AppResults[]; // Modify the data structure as per your API response
    nextCursor: string | null; // Cursor for the next page
  }
interface RequestParams {
    target: string
    token: string | null
    method: string
    paginate: boolean
}

// const fetcher = async ({target: url, token, method, paginate} :RequestParams) => 
//     fetch(url, {
//     method: method,
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   }).then((res) => res.json());

const fetcher = (url: string, method: string, token: string) =>{
    console.log(url)
    const requestHeaders = new Headers();
    if (token) {
        console.log("token applied")
        requestHeaders.append("Authorization", token) 
    }

    const requestOptions: RequestInit = {
        method: method,
        headers: requestHeaders,
        redirect: 'follow',
    };

    return(

    fetch(url, requestOptions
    ).then((res) => res.json())
    )
}


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

    const {data: bubbleData, error: bubbleError, isLoading: bubbleIsLoading} = callAPI<AppResponse>(bubbleOffersUrl, bubbleOffersToken, "GET", true)
    const {data: nbData, error: nBError, isLoading: nBIsLoading} = callAPI<Promotion[]>(networkBOffersUrl, null, "GET", false)
    // const combinedArray = getArrData(bubbleData, nbData)

    console.log("Bubble", bubbleData)
    console.log("NB", nbData)


    return (
        <>
        <ErrorOrLoading
            error = {bubbleError || nBError}
            isLoading = {bubbleIsLoading || nBIsLoading}
            isResponseData = {bubbleData || nbData}
        />
        {/* {combinedArray && <ApiTable tableProps={combinedArray.dataArr}></ApiTable>} */}
        {/* {combinedArray && <ApiTable tableProps={combinedArray.singleArr}></ApiTable>} */}
        </>
    )
}

// const getArrData = (bubbleData: AppResponse | AppResponse[]| null | undefined, nbData:  Promotion[] | null | undefined) => {
//     if (!bubbleData || !nbData) {
//         return null;
//     }
//     const dataArr: ApiArray[] = []
//     const singleArr: ApiArray[] = []

//     bubbleData.response.results.map((offer, i: number) => 
//         dataArr.push({Id: offer.nimda_id_number, items: [{"Name": offer.name_text, "Discount": offer.discount_percentage_number ? offer.discount_percentage_number.toFixed(2)+"%" : "£"+offer.discount_amount_number, "Expires": offer.expiry_date_date.split('T')[0], Source: "Bubble"} ]}),
//     )
//     nbData.map((set, j) => 
//         set["promo-data"].map((promo, i: number) => {
//             let promoExpiry: string = promo['expiry-date']
//             dataArr.forEach((entry, i) => {
//                 if(promo['promo-id'] == entry.Id){
//                     promo['splits-details'].map((split) => 
//                         dataArr[i].items.splice(i, 0, {"Name": promo.name, "Discount": split['gross-commission'].replace("&pound;", "£"), "Expires": promoExpiry, Source: "Network B" }),
//                     )
                    
//                 } 
//                 else {
//                     promo['splits-details'].map((split) => 
//                         singleArr.push({"Id": promo['promo-id'], items: [{"Name": promo.name, "Discount": split['gross-commission'].replace("&pound;", "£"), "Expires": promoExpiry, Source: "Network B"}] }),
//                     )
//                 }
//                 })
//         })
//     )
//     return (
//         {dataArr}
//     );

// }
const callAPI = <T,>(target: string, token: string | null, method: string, paginate: boolean) => {
    if(paginate){
        const [allData, setAllData] = useState<AppResponse[]>([]);
        const [nextCursor, setNextCursor] = useState<string>("0");
        const { data, error } = useSWR<AppResults>(
            nextCursor
            ? [`${target}?cursor=${nextCursor}`, method, token]
            : null,
            fetcher
            );
            console.log("Paginate, "+target+", "+nextCursor)
        
          useEffect(() => {
            if (data) {
                console.log(data)
              setAllData((prevData) => [...prevData, ...data.response.results]);
              let cursorPos = (parseInt(nextCursor)+1).toString()
              setNextCursor(cursorPos);
            }
          }, [data]);
        
          const isLoading = !data && !error;
        
          return {
            data: allData,
            error,
            isLoading,
          };

    } else {
        const { data, error, isLoading} = useSWR<T>([target, token, method, paginate], fetcher)
        return (
            {data, error, isLoading}
        )
    }
    
}

const ErrorOrLoading = (error: any, isLoading: boolean, isResponseData: boolean) => {
    if (error != undefined) return (
        <div>{error.message}</div>
    )
    if (isLoading == true) return (
        <div>Loading...</div>
    )
    if (isResponseData == false) return (
        <div>Failed to load</div>
    )
    return (
        null
    )
}
