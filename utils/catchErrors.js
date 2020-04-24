export default function catchErrors(error, displayError) {
  let errorMsg;
  if (error.response) {
    // Server respond without 2XX code
    errorMsg = error.response.data;
    console.error('Error respose', errorMsg);

    // For Cloudinary image upload error
    if (error.response.data.error) {
      errorMsg = error.response.data.error.message;
    }
  } else if (error.request) {
    // Server respond nothing
    errorMsg = error.request;
    console.error('Error request', errorMsg);
  } else {
    // Something different happened
    errorMsg = error.message;
    console.error('Error message', errorMsg);
  }
  displayError(errorMsg);
}
