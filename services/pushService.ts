import { supabase } from "../utils/supabase";

// Registrar o actualizar un token en Supabase
export const registerPushToken = async (token: string) => {
    if (!token) return null;

    try {
        // Upsert asegura que no haya duplicados
        const { data, error } = await supabase
            .from("push_tokens")
            .upsert([{ token }], { onConflict: "token" }) // si ya existe, lo reemplaza
            .select("*");

        if (error) {
            console.error("Error registrando token:", error.message);
            return null;
        }

        return data?.[0] || null;
    } catch (err) {
        console.error("Error inesperado registrando token:", err);
        return null;
    }
};
