import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Heading } from '@keystone-ui/core';


export default function BubblePromotions() {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer e3295439979be8e5b83c2ef3eb754013");

    const requestOptions: RequestInit = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
    };

    fetch("https://app.carma.earth/api/1.1/obj/offer--", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
    return (
        <>
            <PageContainer header={<Heading type="h3">BUBBLE</Heading>}>
            </PageContainer>
        </>
    )
}