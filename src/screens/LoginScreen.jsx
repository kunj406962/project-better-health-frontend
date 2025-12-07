import React, { useState } from "react";
import {
    Linking,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../contexts/AuthContext";
import GoogleLogin from "../component/GoogleLogin";
import OAuth from "./OAuth";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.min(361, width - 32);

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {login}= useAuth();

    const handleSignIn = async () => {
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Please fill in both fields.");
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

        setIsSubmitting(true);
        const result= await login(email, password)
        setIsSubmitting(false)
        if(!result.success){
            Alert.alert("Login Failed", result.error)
        }
        else{
            navigation.navigate("Water")
        }
    };

    const handleGoogle = () => {
        Alert.alert("Todo")
    };

    return (
        <View style={styles.root}>
            <LinearGradient
                colors={["#FAF5FF", "#FFF7ED", "#FDF2F8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBackground}
            />

            <View style={styles.blobsLayer}>
                <Image
                    source={{ uri: "https://placehold.co/256x256" }}
                    style={styles.topBlobImage}
                    blurRadius={8}
                />
                <View style={[styles.blob, styles.blobPurple]} />
                <View style={[styles.blob, styles.blobOrange]} />
                <View style={[styles.blob, styles.blobPink]} />
            </View>

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
                        Your wellness journey starts here
                    </Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeading}>
                        <Text style={styles.headingTitle}>Welcome Back</Text>
                        <Text style={styles.headingSubtitle}>
                            Sign in to continue your journey
                        </Text>
                    </View>

                    <View style={styles.cardBody}>
                        <View style={styles.field}>
                            <Text style={styles.fieldLabel}>Email</Text>
                            <View style={styles.inputWrapper}>
                                <View style={styles.leftIconBox}>
                                    <View style={styles.mailLineTop} />
                                    <View style={styles.mailOutline} />
                                </View>

                                <TextInput
                                    style={styles.input}
                                    placeholder="you@example.com"
                                    placeholderTextColor="#717182"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    textContentType="none"
                                    autoComplete="off"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>

                        <View style={[styles.field, { marginTop: 16 }]}>
                            <Text style={styles.fieldLabel}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <View style={styles.leftIconBox}>
                                    <View style={styles.lockBody} />
                                    <View style={styles.lockArc} />
                                </View>

                                <TextInput
                                    style={[styles.input, styles.passwordInput]}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#717182"
                                    secureTextEntry={!showPassword}
                                    textContentType="oneTimeCode"
                                    autoComplete="off"
                                    value={password}
                                    onChangeText={setPassword}
                                />

                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setShowPassword((prev) => !prev)}
                                >
                                    <View style={styles.eyeShape} />
                                    <View style={styles.eyePupil} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.forgotRow}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("ForgotPassword")}
                            >
                                <Text style={styles.forgotText}>Forgot password?</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.signInWrapper}
                            onPress={handleSignIn}
                            disabled={isSubmitting}
                        >
                            <LinearGradient
                                colors={["#9810FA", "#F54900"]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.signInButton}
                            >
                                <Text style={styles.signInText}>
                                    {isSubmitting ? "Signing in..." : "Sign In"}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.separatorRow}>
                            <View style={styles.separatorLine} />
                            <View style={styles.separatorLabelBox}>
                                <Text style={styles.separatorLabel}>Or continue with</Text>
                            </View>
                        </View>
                        <Text>Heyyyy</Text>
                        <GoogleLogin/>
                        <TouchableOpacity
                            style={styles.socialButton}
                            onPress={handleGoogle}
                        >
                            <Image
                                source={require("../../assets/icons/google_icon.png")}
                                style={styles.socialIcon}
                                resizeMode="contain"
                            />
                            <Text style={styles.socialText}>Continue with Google</Text>
                        </TouchableOpacity>

                        <View style={styles.footerRow}>
                            <Text style={styles.footerText}>Don't have an account?</Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("Register")}
                            >
                                <Text style={styles.footerLink}>Sign Up</Text>
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
    blobsLayer: {
        ...StyleSheet.absoluteFillObject,
    },
    topBlobImage: {
        position: "absolute",
        left: 137,
        top: 0,
        width: 256,
        height: 256,
        opacity: 0.1,
        borderRadius: 9999,
    },
    blob: {
        position: "absolute",
        borderRadius: 9999,
    },
    blobPurple: {
        width: 192,
        height: 192,
        left: 40,
        top: 213,
        backgroundColor: "rgba(218,178,255,0.2)",
    },
    blobOrange: {
        width: 224,
        height: 224,
        left: 129,
        top: 415,
        backgroundColor: "rgba(255,184,106,0.2)",
    },
    blobPink: {
        width: 160,
        height: 160,
        left: 131,
        top: 426,
        backgroundColor: "rgba(253,165,213,0.2)",
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
        height: 525,
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
        fontSize: 16,
        color: "#717182",
    },
    cardBody: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    field: {
        width: "100%",
    },
    fieldLabel: {
        fontSize: 14,
        color: "#0A0A0A",
        marginBottom: 8,
    },
    inputWrapper: {
        width: "100%",
        height: 36,
        justifyContent: "center",
    },
    input: {
        width: "100%",
        height: 36,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E9D4FF",
        backgroundColor: "#F3F3F5",
        paddingHorizontal: 40,
        paddingVertical: 4,
        fontSize: 16,
        color: "#0A0A0A",
    },
    passwordInput: {
        paddingRight: 40,
    },
    leftIconBox: {
        position: "absolute",
        left: 12,
        top: 10,
        width: 16,
        height: 16,
    },
    mailLineTop: {
        position: "absolute",
        left: 1.33,
        top: 4.67,
        width: 13.33,
        height: 4,
        borderWidth: 1.33,
        borderColor: "#99A1AF",
    },
    mailOutline: {
        position: "absolute",
        left: 1.33,
        top: 2.67,
        width: 13.33,
        height: 10.67,
        borderWidth: 1.33,
        borderColor: "#99A1AF",
    },
    lockBody: {
        position: "absolute",
        left: 2,
        top: 7.33,
        width: 12,
        height: 7.33,
        borderWidth: 1.33,
        borderColor: "#99A1AF",
    },
    lockArc: {
        position: "absolute",
        left: 4.67,
        top: 1.33,
        width: 6.67,
        height: 6,
        borderWidth: 1.33,
        borderColor: "#99A1AF",
        borderRadius: 3.5,
    },
    eyeButton: {
        position: "absolute",
        right: 12,
        top: 10,
        width: 16,
        height: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    eyeShape: {
        width: 13.33,
        height: 9.33,
        borderRadius: 9,
        borderWidth: 1.33,
        borderColor: "#99A1AF",
    },
    eyePupil: {
        position: "absolute",
        width: 4,
        height: 4,
        borderRadius: 2,
        borderWidth: 1.33,
        borderColor: "#99A1AF",
    },
    forgotRow: {
        marginTop: 8,
        alignItems: "flex-end",
    },
    forgotText: {
        fontSize: 14,
        color: "#9810FA",
    },
    signInWrapper: {
        marginTop: 12,
    },
    signInButton: {
        height: 36,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    signInText: {
        color: "#FFFFFF",
        fontSize: 14,
    },
    separatorRow: {
        marginTop: 18,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    separatorLine: {
        position: "absolute",
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: "rgba(0,0,0,0.1)",
    },
    separatorLabelBox: {
        paddingHorizontal: 8,
        backgroundColor: "#FFFFFF",
    },
    separatorLabel: {
        fontSize: 14,
        color: "#6A7282",
    },
    socialButton: {
        marginTop: 12,
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E9D4FF",
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        columnGap: 10,
    },
    socialIcon: {
        width: 18,
        height: 18,
    },
    socialText: {
        fontSize: 14,
        color: "#0A0A0A",
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
