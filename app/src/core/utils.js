import { Platform } from "react-native"
import ProfileImage from '../assets/profile.png'
import { ADDRESS, DOMAIN } from "./api"

//instead of console.log function that formats/indents
//objects for better readability?

function log(){
    for(let i=0; i<arguments.length; i++){
        let arg=arguments[i]
        //stringify and indent object
        if(typeof arg === 'object'){
            arg = JSON.stringify(arg, null, 2)
        }
        console.log(`[${Platform.OS}]`,arg)
    }

}

function thumbnail(url) {
    // console.log("Thumbnail URL:", url); // Log the URL
    
    if (!url) {
        return ProfileImage;
    }
    
    const uri = 'https://' + DOMAIN + url;
    // console.log("Thumbnail URI:", uri); // Log the URI
    return {
        uri: uri
    };
}


export default {log, thumbnail}