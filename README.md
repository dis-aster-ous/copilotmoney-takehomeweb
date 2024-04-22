<img width="1512" alt="Screenshot 2024-04-21 at 9 14 04 PM" src="https://github.com/dis-aster-ous/copilotmoney-takehomeweb/assets/6699823/7cabb959-c74a-4146-8532-aa2c46d9d47d">

Deployed to https://dis-aster-ous.github.io/copilotmoney-takehomeweb/

# To Run Locally
```
nvm use
npm ci
npm run dev # visit http://localhost:3000
```

Original README + requirements follow:

-------------

# Take Home Exercise

Please spend up to half a day building a web app for tracking birds. If you're running short on time, feel free to scope it down according to the priorities you feel are more important.

# User experience

The app will display a collection of birds along with their names in English and Latin. When clicking on a bird, users will be able to see its details and register a note about it.

## Design specs

As part of the assignment, you'll receive a link to a Figma document showing the full specs for the project. You are encouraged to ask questions but feel free to make assumptions and continue building.

## API and data model

The API will be based on Firebase's Firestore. As part of the assignment, you'll get the configuration data for a Firebase project that has already been created for you. The documents will exist under the `/birds` paths. These documents are guarded to be available only to signed-in users (you'll need to use Firebase Auth's anonymous log in). The project should depend on only client-side APIs (i.e., there should be no REST requests to get the data, but instead, the web client requests the data directly from Firestore).

The spec for each document is as follows:

```
Document path: /birds/<Bird ID>
Data:
{
  "uid": "<Bird ID>",
  "name": {
      "spanish": "<Bird Name Spanish>",
      "english": "<Bird Name English>",
      "latin": "<Bird Name Latin>",
  },
  "images": {
      "thumb": "<Bird Thumb Image>",
      "full": "<Bird Full Image>"
  },
  "sort": <Bird Index>
}
```

There may be more data in the documents, but you can ignore them.

The users' notes related to each bird will be stored in the same bird's document as an array of objects that will contain at least the userID, the note's title and content, and a timestamp. This array should be stored in a new field named `notes`. The notes should be sorted by most recent.

## Image watermarks

All images need to be watermarked before they are displayed to the user. In order to watermark, you need to invoke the following HTTP function:

`POST https://us-central1-copilot-take-home.cloudfunctions.net/watermark`

The body should contain the bytes of the image (should be jpeg, the original format of the bird URLs), and the headers should contain the `application/octet-stream` Content-Type header, and the number of bytes in the Content-Length header. The response will have the Content-Length header, the Content-Type header with `image/jpeg`, and the body will be the bytes of a JPEG image.

If you have any questions or issues, you are encouraged to ask the interviewer.

## Project dependencies

External dependencies are required in order to use Firebase, feel free to use npm or yarn as the package manager. Any other dependencies are also allowed (as long as they don't abstract large portions of the assignment).

## Delivery

Please clone this repository and create a new private Github repository under your account, giving the interviewer read access.

Please also send an email to the interviewer letting them know when you've finished the exercise.

## What we're looking for

* UI matches the design spec as closely as possible.
* Proper use of Firestore's event listeners for changed data.
* Handle slow and failed downloads gracefully.
* App responsiveness (handle background tasks efficiently).

## Nice to haves (but not required)

* Responsive behavior. The project is defined for desktop web, but feel free to squeeze in your adaptation to mobile web if time allows it.

## Questions and final note

Feel free to ask the interviewer any questions you might have! And please remember to scope things down if you're running short on time.
