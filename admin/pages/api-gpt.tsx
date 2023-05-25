import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Heading } from '@keystone-ui/core';
import useSWR from 'swr'
import { AppResponse, AppResults, AppOffer, Promotion, PromotionData, PromoCategory, PromoSplitDetails, TableProps, ApiArray, ApiArrayItem } from '../interfaces/reconcilliation';
import ApiTable from '../components/api-table';
import { useEffect, useState } from 'react';


const bubbleOffersUrl = process.env.NEXT_PUBLIC_CARMA_APP_OFFERS_API_URL ?? 'i do not exist';
const networkBOffersUrl = process.env.NEXT_PUBLIC_NETWORKB_PROMOTIONS_API_URL ?? '';
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

const netBFetcher = async (params: RequestParams) => {
    console.log("url: ",params.target)
    fetch(params.target, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${params.token}`,
    },
  }).then((res) => res.text()).catch((error) => {
    console.log(error.message)
  }
)
}

const bubbleFetcher = (url: string, method: string, token: string) =>{
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
    .catch((error) => {
        console.log(error.message)
      }
    ))
}

function TriggerAPIButton({children}: any) {
    return (
        <button>
            {children}
        </button>
    );
}


export default function BubblePromotions() {
    return (
        <>
            <PageContainer header={<Heading type="h3">API Reconcilliation</Heading>}>
                {/* <TriggerAPIButton></TriggerAPIButton> */}
                <ApiDisplay></ApiDisplay>
            </PageContainer>
        </>
    )
}

function ApiDisplay() {
    const [shouldFetchBubble,setShouldFetchBubble] = useState<boolean>(false)
    const [shouldFetchNetB,setShouldFetchNetB] = useState<boolean>(false)
    
    const {data: bubbleData, error: bubbleError, isLoading: bubbleIsLoading} = callBubbleAPI(bubbleOffersUrl, bubbleOffersToken, "GET", true, shouldFetchBubble)
    const {data: nbData, error: nBError, isLoading: nBIsLoading} = callNetBAPI(networkBOffersUrl, null, "GET", false, shouldFetchNetB)
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
        <button onClick={() => setShouldFetchBubble(true)}>
            Fetch Bubble
        </button>
        <button onClick={() => setShouldFetchNetB(true)}>
            Network B
        </button>
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
function callBubbleAPI(target: string, token: string | null, method: string, paginate: boolean, shouldFetchBubble: boolean){
    const [allData, setAllData] = useState<AppResponse[]>([]);
    const [nextCursor, setNextCursor] = useState<string>("0");
    const { data, error } = useSWR<AppResults>(shouldFetchBubble?
        (nextCursor
        ? [`${target}?cursor=${nextCursor}`, method, token]
        : null): null,
        bubbleFetcher
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
}

function callNetBAPI(target: string, token: string | null, method: string, paginate: boolean, shouldFetchNetB: boolean){

    const { data, error, isLoading} = useSWR(shouldFetchNetB?{target, token}:null, netBFetcher)
        return (
            {data, error, isLoading}
        )
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
