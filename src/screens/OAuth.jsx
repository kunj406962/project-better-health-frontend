//231196661942-140htqkjtai31vd6dv2vr6outinl5luj.apps.googleusercontent.com
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useState } from "react"
import { Button, View } from "react-native"

WebBrowser.maybeCompleteAuthSession()
export default function OAuth(){
    const [userInfo, setUserInfo]= useState(null);
    const [request, response, promptAsync]= Google.useAuthRequest({
        androidClientId: "231196661942-vd0n8istm8q3me9je0996to8vkt09qja.apps.googleusercontent.com"
    })
    return(
        <View>
            <Button title="sign in with gooole" onPress={()=>promptAsync()}/>
        </View>
    )

}