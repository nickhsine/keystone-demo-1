import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Heading } from '@keystone-ui/core';

function uploadFile(textField: string, fileName: string) {
    const textarea = document.getElementById(textField) as HTMLTextAreaElement;
    const text = textarea.value;
  
  const formData = new FormData();

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
      file: null, 
    },
  });

  formData.append('operations', operations);

  const map = JSON.stringify({
    '0': ['variables.file'],
  });

  formData.append('map', map);

  const blob = new Blob([text], { type: 'text/json' });

  formData.append('0', blob,  fileName+'.json');
    fetch('files/', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log('File uploaded');
        } else {
          console.error('File upload failed');
        }
      })
      .catch((error) => {
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
                    <div className="networbBData">
                        <textarea id="networkbjson" cols={30} rows={10}></textarea>
                        <button type="button" onClick={() => uploadFile("networkbjson", "networkb")}>Upload</button>
                    </div>
                </div>
            </PageContainer>
        </>
    )
}