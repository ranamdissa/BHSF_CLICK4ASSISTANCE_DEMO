import {ANNOTATION_VIDEO_DISPLAY, ANNOTATION_PARENT, VIDEO_PLAYING_MODE} from './GlobalConstants';
import * as THREE from 'three';

export const ANNOTATION_CONTACT_TEXT = '';
export const CONTACT_URL = 'WEBSITE';
export const YOUTUBE = 'YOUTUBE';
export const INSTAGRAM = 'INSTAGRAM';
export const SPOTIFY = 'SPOTIFY';
export const TWITTER = 'TWITTER';
export const TIKTOK = 'TIKTOK';
export const IMDB = 'IMDB';
export const FACEBOOK = 'FACEBOOK';
export const ENQUIRE_EMAIL = 'ENQUIRE';
export const LINKED_IN = 'LINKEDIN';
export const HAS_MEDIA_CAROUSEL_LINK = 'MORE';
export const SEND_TO_EMAIL = 'SEND TO';
export const CANTALOUPE_IMAGE_SERVER = "https://iiif.v21artspace.com/iiif/2/made-with-many%2Fmwm-time-to%2F"
export const ANNOTATION_TEXT_ALIGNMENT = "center";
export const ANNOTATION_TEXT_LINE_HEIGHT = "1.5";
export const GALLERY_LINK_LABEL = "WORKS";


const AnnotationsDB = [
    /* Video annotation starts */
    {
        //This Video
        //gold_stand_video
        paintingId: 'gold_stand_video',
        videoId: 'Z4V1',
        standaloneVideoElementId: 'Z4V1',
        videoURL: 'Z4V1.mp4',
        displayType: ANNOTATION_VIDEO_DISPLAY.VIDEO_STANDALONE,
        headerText: `<h5>WELCOME</h5>`,
        bodyText: null,
        displayMesh: 'Y',
        displayHeight: 90,
        videoAutoPlay: 'N',
        // videoPlaySpriteImageURL: '/assets/sprites/videoPlayButtonBlack.svg',
        // videoPauseSpriteImageURL: '/assets/sprites/videoPauseButtonBlack.svg',
        // videoButtonScale: {x: .2, y: .2, z: .2},
        // videoButtonPos:{x:9.17728, y:0.606917,z:11.6652},
        videoTextureEncoding: THREE.sRGBEncoding,
        videoButtonPos:{x:-8.31443,y:-1.5 ,z:-29.7395 }
    },
    /* Video annotation ends */

    /* Audio annotation starts */
    {
        //Audio
        paintingId: 'greenPanel',
        videoId: 'audio01',
        standaloneVideoElementId: 'audio01',
        videoURL: 'Z9V6c.mp4', // this is not used for audo. The source is set from the audio tag in src/client-data/VideosComponent.js
        displayType: ANNOTATION_VIDEO_DISPLAY.AUDIO_PLAYER, // must set annotationParent: ANNOTATION_PARENT.PARENT_NONE,
        headerText: 'Sample',
        bodyText: null,
        displayMesh: 'Y',
        displayHeight: 90,
        videoAutoPlay: 'N',
        videoPlaySpriteImageURL: '/assets/sprites/SoundIconYellow.svg',
        videoPauseSpriteImageURL: '/assets/sprites/videoPauseButton.svg',
        // videoButtonScale: {x: .2, y: .2, z: .2},
        videoButtonPos:{x:-9.6097, y:-1.7,z:-26.6597},
        annotationParent: ANNOTATION_PARENT.PARENT_NONE,
        //videoTextureEncoding: THREE.sRGBEncoding,

    },
    /* Audio annotation ends */

    /* Chat annotation starts */
    // {
    //     //Red Floating annotation!!
    //     paintingId: 'Chat01',
    //     videoId: null,
    //     videoURL: null,
    //     //This is of ID=1
    //     chatTitle: "BSHF",
    //     chatSrc: 'https://v4in1-ti.click4assistance.co.uk/DefaultChat.aspx?AccGUID= a16050ca-4750-44bd-8bec-16a479bf22c6 &ScriptID=1&ToolType=1',
    //     headerText: '',
    //     bodyText: ``,
    //     annotationPos: {x:-1.27073 ,y:-1.01923,z:1.3573},
    //     annotationParent: ANNOTATION_PARENT.PARENT_NONE,
    //     spriteImageURL:process.env.PUBLIC_URL + '/assets/sprites/ChatDotsFill.svg',
    //     displayMesh: 'N',
    // },
    {
        //Red Floating annotation!!
        paintingId: 'Chat01',
        videoId: null,
        videoURL: null,
        //This is has an ID=4
        chatTitle: "Rana Inc.",
        chatSrc: 'https://v4in1-ti.click4assistance.co.uk/DefaultChat.aspx?AccGUID= a16050ca-4750-44bd-8bec-16a479bf22c6 &ScriptID=4&ToolType=1',
        headerText: '',
        bodyText: ``,
        annotationPos: {x:-1.27073 ,y:-1.01923,z:1.3573},
        annotationParent: ANNOTATION_PARENT.PARENT_NONE,
        spriteImageURL:process.env.PUBLIC_URL + '/assets/sprites/ChatDotsFill.svg',
        displayMesh: 'N',
    },
    {
        //Red Floating annotation!!
        paintingId: 'Chat02',
        videoId: null,
        videoURL: null,
        //This is of Id=3
        chatTitle: "LA MEDICA",
        chatSrc: 'https://v4in1-ti.click4assistance.co.uk/DefaultChat.aspx?AccGUID= a16050ca-4750-44bd-8bec-16a479bf22c6 &ScriptID=3&ToolType=1',
        headerText: '',
        bodyText: ``,
        annotationPos: {x:-1.27073  ,y:-1.01923,z:0.499758 },
        annotationParent: ANNOTATION_PARENT.PARENT_NONE,
        spriteImageURL:process.env.PUBLIC_URL + '/assets/sprites/ChatDotsFill.svg',
        displayMesh: 'N',
    },

    // painting_id = Chat01  :{x:-1.27073 ,y:-1.01923,z:1.3573}   red
    // painting_id = Chat02  :{x:-1.27073  ,y:-1.01923,z:0.499758 }  yellow
    // painting_id = Chat03  :{x:-1.27073  ,y:-1.01923,z:-0.301427 }  green
    // painting_id = Chat04  :{x:-1.27073  ,y:-1.01923,z:-1.24492 }   blue
    // painting_id = Chat05  :{x:-1.27073  ,y:-1.01923,z:-2.05868 }   white


    // {
    //     paintingId: 'pinkPanel',
    //     videoId: null,
    //     videoURL: null,
    //     chatGroupName: 'https://app.sli.do/event/7hnbnv22',
    //     headerText: '<h5>Yellow</h5><h6>Experimental Preservation</h6>',
    //     bodyText: `<br>This studio is grounded on the idea that all architectural work can be placed within a cultural continuum as the outcome of a complex cultural, social, and political struggle. Investigating the production of architecture in dialogue with existing works, this is an understanding of architecture as a process rather than as a revered object to be preserved. What, then, does it mean to preserve? Indeed, is it really possible to preserve?<br>This studio tackles these discussions by transforming Notre-Dame Cathedral and its urban surroundings, following the fire of April 2019 that destroyed Eugène-Emmanuel Viollet-le-Duc’s iconic spire. The event unleashed a passionate debate about how to face the repairs. Should the Cathedral be restored as it was? Or should a competition for a brand new roof be organised?.<br>The project aims to terraform much of the island’s public spaces, converting the entire island to pedestrian-only space, therefore restricting the use of vehicles in the area. This also allows roads and parking lots to be converted in gardens and pedestrian pathways. The idea is heavily inspired by the river parks in Japan, which have proven to be a positive addition to the urban landscape.<br>This is the recurrent, sterile debate on preservation. Rather than falling into the trap of this infertile discussion, the studio explored the complexities surrounding Notre-Dame’s restoration with a focus on ‘experimental preservation’.<br>The resulting proposals for a National Centre for Heritage and Preservation thereby establish a close physical relationship with Notre-Dame Cathedral and a grounded theoretical relationship with Viollet‑le‑Duc’s principles of restoration. The Centre acts as a public hub for the research into the ongoing development of both the Île de la Cité and Notre‑Dame itself. <br><b>Studio Leaders:</b><br>Dr. Josep-Maria Garcia-Fuente<br>Tom Ardron<br><b>Guest Crtics:</b><br>Alexis Lautier<br>Jean-François Cabestan<br>Oliver Chapman<br>Alejandro Lapunzina<br><b>Students:</b><br>Anthony Chau<br>Aruzhan Sagynay<br>Cheuk Lum Charlie Wong<br>Denisa-Iuliana Calomfirescu<br>Harry Goacher<br>Isabel Vile<br>Iulia Ştefancu<br>Jing Olyvia Tam<br>Ka Hei Chan<br>Latifa Al Nawar<br>Oliver Gabe<br>Reuben Jones<br>Rory Kavanagh<br>Victoria Peake<br>Xin Guo<br>Yanchao Sun<br>Zhi Xuan Yew.`,
    //     annotationPos: {x:-8.48606  ,y:-2.02766 ,z:-29.5833 },
    //     annotationParent: ANNOTATION_PARENT.PARENT_NONE,
    //     spriteImageURL:process.env.PUBLIC_URL + '/assets/sprites/ChatDotsFill.svg',
    // },
    /* Chat annotation ends */

    /* Pdf annotation starts*/
    {
        paintingId: 'bluePanel',
        videoId: null,
        videoURL: null,
        imageURL: 'https://iiif.v21artspace.com/iiif/2/bshf%2Fshow-2020%2Ftest-booklet.pdf/full/full/0/default.jpg?page=1',
        headerText: '<h5>23rd Annual Autumn Meeting</h5>',
        bodyText: `<b>Lorem Ipsum</b> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
        urlLink1Label: 'DOWNLOAD',
        urlLink1: '/pdf/test-booklet.pdf',
        annotationPos: {x:-7.74,y:-1.68,z:-26.54},
        annotationParent: ANNOTATION_PARENT.PARENT_NONE,
        spriteImageURL:process.env.PUBLIC_URL + '/assets/sprites/DownloadIconYellow.svg',
    },
    {
        paintingId: 'yellowPanel',
        videoId: null,
        videoURL: null,
        imageURL: 'https://iiif.v21artspace.com/iiif/2/bshf%2Fshow-2020%2Ftest-booklet.pdf/full/full/0/default.jpg?page=1',
        bodyText: `<b>Lorem Ipsum</b> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
        // annotationParent: ANNOTATION_PARENT.PARENT_NONE,
        //annotationPos:{x:0.09, y:-1.12221, z:7.20203},
        urlLink1Label: 'DOWNLOAD',
        urlLink1: '/pdf/test-booklet.pdf',
        annotationPos: {x:-6.42855,y:-1.67578 ,z:-28.5581},
        annotationParent: ANNOTATION_PARENT.PARENT_NONE,
        spriteImageURL:process.env.PUBLIC_URL + '/assets/sprites/DownloadIconYellow.svg',
    },
    {
        paintingId: 'whitePanel',
        videoId: null,
        videoURL: null,
        imageURL: 'https://iiif.v21artspace.com/iiif/2/bshf%2Fshow-2020%2Ftest-booklet.pdf/full/full/0/default.jpg?page=1',
        headerText: '<h5>23rd Annual Autumn Meeting</h5>',
        bodyText: `<b>Lorem Ipsum</b> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
        urlLink1Label: 'DOWNLOAD',
        urlLink1: '/pdf/test-booklet.pdf',
        spriteImageURL:process.env.PUBLIC_URL + '/assets/sprites/DownloadIconYellow.svg',
    },
    {
        paintingId: 'blackPanel',
        videoId: null,
        videoURL: null,
        imageURL: 'https://iiif.v21artspace.com/iiif/2/bshf%2Fshow-2020%2Ftest-booklet.pdf/full/full/0/default.jpg?page=1',
        headerText: '<h5>23rd Annual Autumn Meeting</h5>',
        bodyText: `<b>Lorem Ipsum</b> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
        urlLink1Label: 'DOWNLOAD',
        urlLink1: '/pdf/test-booklet.pdf',
        spriteImageURL:process.env.PUBLIC_URL + '/assets/sprites/DownloadIconYellow.svg',
    },
    /* Pdf annotation ends */


];

export {AnnotationsDB};
