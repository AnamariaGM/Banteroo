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

function formatTime(date) {
    if (date === null) {
      return "-";
    }
    const now = new Date();
    const s = Math.abs(now - new Date(date)) / 1000;
    // Seconds
    if (s < 60) {
      return "now";
    }
    //Minutes
    if (s < 60 * 60) {
      const m = Math.floor(s / 60);
      return `${m}m ago`;
    }
    // Hours
    if (s < 60 * 60 * 24) {
      const h = Math.floor(s / (60 * 60));
      return `${h}h ago`;
    }
    // Days
    if (s < 60 * 60 * 24 * 7) {
      const d = Math.floor(s / (60 * 60 * 24));
      return `${d}d ago`;
    }
    // Weeks
    if (s < 60 * 60 * 24 * 7 * 4) {
      const w = Math.floor(s / (60 * 60 * 24 * 7));
      return `${w}w ago`;
    }
    // Years
    if (s < 60 * 60 * 24 * 7 * 4 * 12) {
      const y = Math.floor(s / (60 * 60 * 24 * 365));
      return `${y}y ago`;
    }
  }

export default {log, thumbnail, formatTime}