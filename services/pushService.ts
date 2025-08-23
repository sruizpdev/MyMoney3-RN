import { supabase } from "../utils/supabase";

// Registrar un token en Supabase
export const registerPushToken = async (token: string) => {
    if (!token) return null;

    const { data, error } = await supabase
        .from("push_tokens")
        .insert([{ token }])
        .select("*");

    if (error) {
        // Si el token ya existe, podemos ignorar el error
        if (error.code === "23505") {
            console.log("Token ya registrado:", token);
            return token;
        }
        console.error("Error registrando token:", error.message);
        return null;
    }

    return data?.[0] || null;
};
