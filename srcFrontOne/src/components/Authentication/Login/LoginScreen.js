import React, {useState} from "react";
import {Image, useWindowDimensions, View, Button} from "react-native";
import logo from "../imgs/logo.png";
import styles from "./styles";
import InputLogin from "./InputLogin/InputLogin";
import ButtonLogin from "./ButtonLogin/ButtonLogin";
import SocialButtons from "./SocialButtons/SocialButtons";
import {firebase} from "../../../../firebase-config";


const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {height} = useWindowDimensions();

   const loginUser = async (email, password) => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password)
            navigation.navigate("HomePage");
        } catch (error) {
            alert(error.message)
            console.log(error)
        }
    }
    

    const onForgotPasswordPress = () => {
        navigation.navigate("ForgotPassword")
    }

    const onSignUp = () => {
        navigation.navigate("SignUp")
    }


    return (
        <View style={styles.rootLogin}>
            <Image source={logo} style={[styles.logo, {height: height * 0.3}]} resizeMode="contain"  />

            <InputLogin 
                placeholder="Email" 
                value={email} 
                setValue={(email) => setEmail(email)}
                />
            <InputLogin 
                placeholder="Password" 
                value={password} 
                setValue={(password) => setPassword(password)}
                secureTextEntry={true}
                />

            <ButtonLogin 
                text="Login" 
                onPress={() => loginUser(email, password)} 
                />
            <ButtonLogin 
                text="Forgot Password?" 
                onPress={onForgotPasswordPress} 
                type="TERTIARY"
                />
            
            <SocialButtons />
            
            <ButtonLogin
                text="Don't have an account? Sign Up"
                onPress={onSignUp}
                type="TERTIARY"
                />


        </View>
    )
}


export default LoginScreen;