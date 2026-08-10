import { useEffect } from "react";
import { Alert } from "react-native";
import RegisterScreen from "@/screens/Register/RegisterScreen";

export default function Register() {
    useEffect(() => {
        Alert.alert("Opened", "Register Route");
    }, []);

    return <RegisterScreen />;
}
