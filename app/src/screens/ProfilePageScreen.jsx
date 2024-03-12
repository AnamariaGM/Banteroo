import React, { useState } from "react";
import { Text, View, Image, TouchableOpacity, Platform } from "react-native";
import { launchImageLibraryAsync } from "expo-image-picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import useGlobal from "../core/global";
import utils from "../core/utils";
import Thumbnail from "../common/Thumbnail";

function ProfileImage() {
  const uploadThumbnail= useGlobal(state => state.uploadThumbnail);
  const user= useGlobal(state => state.user);

  const [selectedImage, setSelectedImage] = useState(null);

  const pickImage = async () => {
    let result = await launchImageLibraryAsync({
      mediaTypes: "Images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });
    utils.log("Image picker result:", result.assets[0]);
    
    if (!result.canceled) {
      const selectedImage = result.assets[0];
      // console.log(result.assets[0])
      const uri = selectedImage.uri;
      // console.log(uri)
      const filename = uri.substring(uri.lastIndexOf("/") + 1);
      // console.log(filename)
      const base64 = result.assets[0].base64; // Access base64 property from the result object
      const file = { uri: uri, name: filename, type: 'image/jpeg', base64: base64 }; // Assuming selectedImage.type is the MIME type
      // console.log(file)
      
      uploadThumbnail(file);
    }
    

  // const pickImage = async () => {
  //   let result = await launchImageLibraryAsync({
  //     mediaTypes: "Images",
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //     quality: 1,
  //     base64:true,
  //   });
  
  //   if (!result.canceled) {
  //     const file = result.assets[0]
    
  //     const uri = result.assets[0].uri;
  //     const filename = uri.substring(uri.lastIndexOf("/") + 1);
  //     const file = {uri, name: filename, type: "image/jpeg" }; // Assuming JPEG format
  
  //     utils.log("Image picker result:", file);
  //     uploadThumbnail(file);
  //   }
  };

  return (
    <TouchableOpacity style={{ marginBottom: 20 }} onPress={pickImage}>
      {selectedImage ? (
        <Thumbnail
        url={user.thumbnail}
        size={180}
        />

      ) : (
        <Image
          source={utils.thumbnail(user.thumbnail)}
          style={{
            width: 180,
            height: 180,
            borderRadius: 90,
            backgroundColor: "#e0e0e0",
          }}
        />
      )}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          backgroundColor: "#202020",
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 3,
          borderColor: "white",
        }}
      >
        <FontAwesomeIcon icon="pencil" size={15} color="#d0d0d0" />
      </View>
    </TouchableOpacity>
  );

  // return (
  //   <TouchableOpacity
  //     style={{ marginBottom: 20 }}
  //     onPress={() => {
  //       launchImageLibraryAsync({ includeBase64: true }, (response) => {
  //         utils.log("launchImageLibrary", response);
  //         if (response.didCancel) return;
  //         const file = response.assets[0];
  //         uploadThumbail(file);
  //       });
  //     }}
  //   >
  //     <Image
  //       source={require("../assets/profile.png")}
  //       style={{
  //         width: 180,
  //         height: 180,
  //         borderRadius: 90,
  //         backgroundColor: "#e0e0e0",
  //       }}
  //     />

  //     <View
  //       style={{
  //         position: "absolute",
  //         bottom: 0,
  //         right: 0,
  //         backgroundColor: "#202020",
  //         width: 40,
  //         height: 40,
  //         borderRadius: 20,
  //         alignItems: "center",
  //         justifyContent: "center",
  //         borderWidth: 3,
  //         borderColor: "white",
  //       }}
  //     >
  //       <FontAwesomeIcon icon="pencil" size={15} color="#d0d0d0" />
  //     </View>
  //   </TouchableOpacity>
  // );
}

function ProfileLogout() {
  const logout = useGlobal((state) => state.logout);

  return (
    <TouchableOpacity
      onPress={logout}
      style={{
        flexDirection: "row",
        height: 52,
        borderRadius: 26,
        alignItems: "center",
        paddingHorizontal: 26,
        backgroundColor: "#202020",
        marginTop: 40,
      }}
    >
      <FontAwesomeIcon
        icon="right-from-bracket"
        size={20}
        color="#d0d0d0"
        style={{ marginRight: 12 }}
      />
      <Text
        style={{
          fontWeight: "bold",
          color: "#d0d0d0",
        }}
      >
        Logout
      </Text>
    </TouchableOpacity>
  );
}

function ProfilePageScreen() {
  const user = useGlobal((state) => state.user);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingTop: 100,
      }}
    >
      <ProfileImage />

      <Text
        style={{
          textAlign: "center",
          color: "#303030",
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 6,
        }}
      >
        {user.name}
      </Text>
      <Text
        style={{
          textAlign: "center",
          color: "#606060",
          fontSize: 14,
        }}
      >
        @{user.username}
      </Text>

      <ProfileLogout />
    </View>
  );
}

export default ProfilePageScreen;
