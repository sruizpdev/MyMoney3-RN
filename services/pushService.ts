import { supabase } from "../utils/supabase";

// Registrar un token en Supabase
export const registerPushToken = async (token: string) => {
    if (!token) return null;

    const { data, error } = await supabase
        .from("push_tokens")
        .upsert(
            [{ token }],
            { onConflict: "token" } // 👈 clave: evita duplicados en la columna "token"
        )
        .select("*");

    if (error) {
        console.error("Error registrando token:", error.message);
        return null;
    }

    return data?.[0] || null;
};
