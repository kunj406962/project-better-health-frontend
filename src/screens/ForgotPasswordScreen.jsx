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

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.min(361, width - 32);

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleSend = () => {
        setError("");
        setMessage("");

        if (!email.trim()) {
            setError("Please enter your email.");
            return;
        }

        setIsSending(true);

        setTimeout(() => {
            setIsSending(false);
            setMessage(
                "If this email exists, a reset link will be sent to your inbox."
            );
            Alert.alert("Password", "Reset link simulation.");
        }, 800);
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

                    <Text style={styles.subtitle}>Reset your password</Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeading}>
                        <Text style={styles.headingTitle}>Forgot Password</Text>
                        <Text style={styles.headingSubtitle}>
                            Enter your email to receive a reset link
                        </Text>
                    </View>

                    <View style={styles.cardBody}>
                        <View style={styles.field}>
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

                        <TouchableOpacity
                            style={styles.sendWrapper}
                            onPress={handleSend}
                            disabled={isSending}
                        >
                            <LinearGradient
                                colors={["#9810FA", "#F54900"]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.sendButton}
                            >
                                <Text style={styles.sendText}>
                                    {isSending ? "Sending..." : "Send Reset Link"}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.footerRow}>
                            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                <Text style={styles.footerLink}>Back to login</Text>
                            </TouchableOpacity>
                        </View>

                        {message ? <Text style={styles.infoText}>{message}</Text> : null}
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
        textAlign: "center",
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
    sendWrapper: {
        marginTop: 20,
    },
    sendButton: {
        height: 40,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    sendText: {
        color: "#FFFFFF",
        fontSize: 14,
    },
    footerRow: {
        marginTop: 16,
        alignItems: "center",
    },
    footerLink: {
        fontSize: 14,
        color: "#9810FA",
    },
    infoText: {
        marginTop: 10,
        fontSize: 12,
        color: "#047857",
        textAlign: "center",
    },
    errorText: {
        marginTop: 8,
        fontSize: 12,
        color: "#B91C1C",
        textAlign: "center",
    },
});
