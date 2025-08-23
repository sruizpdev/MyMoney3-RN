// services/pushToken.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

let token: string | null = null;
const TOKEN_KEY = "PUSH_TOKEN";

export const setPushToken = async (t: string) => {
    token = t;
    await AsyncStorage.setItem(TOKEN_KEY, t);
};

export const getPushToken = async (): Promise<string | null> => {
    if (token) return token;

    const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
    token = storedToken;
    return storedToken;
};
