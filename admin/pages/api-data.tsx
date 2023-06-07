import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Heading } from '@keystone-ui/core';
import fs from 'fs';

// let bubbleJson = require("./json/bubble.json")
// let netwrokbJson = require("./json/networkb.json")

function uploadFile(textField: string, fileName: string) {
    const textarea = document.getElementById(textField) as HTMLTextAreaElement;
    const text = textarea.value;
  
   // Create a FormData object
  const formData = new FormData();

  // Create the operations object
  const operations = JSON.stringify({
    query: `
      mutation ($file: Upload!) {
        uploadFile(file: $file) {
          # Specify the fields you expect in the response
          id
          filename
          # ...other fields
        }
      }
    `,
    variables: {
      file: null, // Placeholder for the file variable
    },
  });

  // Append the operations as a field
  formData.append('operations', operations);

  // Create the map object
  const map = JSON.stringify({
    '0': ['variables.file'],
  });

  // Append the map as a field
  formData.append('map', map);

  // Create a Blob from the text content
  const blob = new Blob([text], { type: 'text/plain' });

  // Append the file
  formData.append('0', blob,  fileName+'.txt');

    // Send the file to the server using AJAX (assuming you're using Fetch API)
    fetch('assets/json', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          // File uploaded successfully
          console.log('File uploaded');
        } else {
          // Handle the error case
          console.error('File upload failed');
        }
      })
      .catch((error) => {
        // Handle any network or fetch API errors
        console.error('File upload error:', error);
      });
  }

export default function JsonUpload() {
    return (
        <>
            <PageContainer header={<Heading type="h3">JSON Upload</Heading>}>
                <div className="jsonData">
                    <div className="bubbleData">
                        <textarea id="bubblejson" cols={30} rows={10}></textarea>
                        <button type="button" onClick={() => uploadFile("bubblejson", "bubble")}>Upload</button>
                    </div>
                </div>
            </PageContainer>
        </>
    )
}

function JsonInputField(target: string){

    return(
        <>
            <textarea name={target} id={`${target}frame`} cols={30} rows={10}></textarea>
        </>
    )
}