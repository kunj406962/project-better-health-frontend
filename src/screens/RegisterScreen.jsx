import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Alert,
    Image
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../contexts/AuthContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.min(361, width - 32);

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {register}= useAuth();

    const handleRegister = async () => {
        setError("");

        if (!name.trim() || !email.trim() || !password.trim() || !confirm.trim()) {
            setError("Please fill in all fields.");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Error Please enter a valid email address');
            return;
        }
        if(password.length<8){
            setError("Password has to be at least 8 character")
            return;
        }

        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);
        const result= await register(name, email, password)
        setIsSubmitting(false);
        if(!result.success){
            Alert.alert("Login Failed", result.error)
        }
        else{
            navigation.navigate("Water")
        }
    };

    return (
        <View style={styles.root}>
            <LinearGradient
                colors={["#FAF5FF", "#FFF7ED", "#FDF2F8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBackground}
            />

            <View style={styles.screenFrame}>
                <View style={styles.header}>
                    <View style={styles.logoCircle}>
                        <Image
                            source={require("../../assets/icons/heart_icon_transparent.png")}
                            style={styles.logoIcon}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={styles.mainTitle}>
                        Project <Text style={styles.mainTitleAccent}>Better Health</Text>
                    </Text>

                    <Text style={styles.subtitle}>
                        Create an account to get started
                    </Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeading}>
                        <Text style={styles.headingTitle}>Create Account</Text>
                        <Text style={styles.headingSubtitle}>
                            Fill in your details to sign up
                        </Text>
                    </View>

                    <View style={styles.cardBody}>
                        <View style={styles.field}>
                            <Text style={styles.fieldLabel}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Your name"
                                placeholderTextColor="#717182"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={[styles.field, { marginTop: 12 }]}>
                            <Text style={styles.fieldLabel}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="you@example.com"
                                placeholderTextColor="#717182"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        <View style={[styles.field, { marginTop: 12 }]}>
                            <Text style={styles.fieldLabel}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Create a password"
                                placeholderTextColor="#717182"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>

                        <View style={[styles.field, { marginTop: 12 }]}>
                            <Text style={styles.fieldLabel}>Confirm Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Repeat the password"
                                placeholderTextColor="#717182"
                                secureTextEntry
                                value={confirm}
                                onChangeText={setConfirm}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.signUpWrapper}
                            onPress={handleRegister}
                            disabled={isSubmitting}
                        >
                            <LinearGradient
                                colors={["#9810FA", "#F54900"]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.signUpButton}
                            >
                                <Text style={styles.signUpText}>
                                    {isSubmitting ? "Creating..." : "Sign Up"}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.footerRow}>
                            <Text style={styles.footerText}>Already have an account?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                <Text style={styles.footerLink}>Sign In</Text>
                            </TouchableOpacity>
                        </View>

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    gradientBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    screenFrame: {
        flex: 1,
        width: 393,
        maxWidth: "100%",
        alignSelf: "center",
        paddingTop: 48,
        paddingBottom: 32,
    },
    header: {
        width: CARD_WIDTH,
        alignSelf: "center",
        alignItems: "center",
        gap: 8,
    },
    logoCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(152, 16, 250, 0)",
    },
    logoIcon: {
        width: 60,
        height: 60,
        tintColor: "#9810FA",
    },
    mainTitle: {
        marginTop: 4,
        fontSize: 24,
        fontWeight: "700",
        color: "#9810FA",
    },
    mainTitleAccent: {
        color: "#F54900",
    },
    subtitle: {
        marginTop: 2,
        fontSize: 14,
        color: "#4A5565",
    },
    card: {
        marginTop: 24,
        width: CARD_WIDTH,
        alignSelf: "center",
        borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.9)",
        borderWidth: 1,
        borderColor: "#E9D4FF",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 6,
    },
    cardHeading: {
        paddingTop: 24,
        paddingHorizontal: 24,
        alignItems: "center",
    },
    headingTitle: {
        fontSize: 16,
        color: "#1E2939",
    },
    headingSubtitle: {
        marginTop: 4,
        fontSize: 14,
        color: "#717182",
    },
    cardBody: {
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    field: {
        width: "100%",
    },
    fieldLabel: {
        fontSize: 14,
        color: "#0A0A0A",
        marginBottom: 6,
    },
    input: {
        width: "100%",
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E9D4FF",
        backgroundColor: "#F3F3F5",
        paddingHorizontal: 12,
        fontSize: 15,
        color: "#0A0A0A",
    },
    signUpWrapper: {
        marginTop: 20,
    },
    signUpButton: {
        height: 40,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    signUpText: {
        color: "#FFFFFF",
        fontSize: 14,
    },
    footerRow: {
        marginTop: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        columnGap: 6,
    },
    footerText: {
        fontSize: 14,
        color: "#4A5565",
    },
    footerLink: {
        fontSize: 14,
        color: "#9810FA",
    },
    errorText: {
        marginTop: 8,
        textAlign: "center",
        fontSize: 12,
        color: "#B91C1C",
    },
});
