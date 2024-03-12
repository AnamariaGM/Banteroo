const { FontAwesomeIcon } = require("@fortawesome/react-native-fontawesome")
const {View, Text} = require("react-native")

function Empty ({icon, message, centered=true}){
    return (
        <View
        style={{
            flex:1,
            justifyContent : centered ? 'center':'flex-start',
            alignItems:'center',
            paddingVertical:120
        }}>
            <FontAwesomeIcon
            icon={icon}
            color="#3b3b3b"
            size={90}
            style={{marginBottom:16}}
            />
            <Text
            style={{
                color:'#3b3b3b',
                fontSize:16
            }}>
                {message}
            </Text>
        </View>
            
    )
}

export default Empty