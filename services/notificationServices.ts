import { supabase } from "../utils/supabase";

interface NotificationPayload {
    title: string;
    body: string;
}

// tokenToIgnore: el token del dispositivo que hizo la acción
export const sendPushNotificationToOthers = async (
    payload: NotificationPayload,
    tokenToIgnore: string
) => {
    // 1️⃣ Obtener todos los tokens de la tabla
    const { data: tokens, error } = await supabase
        .from("push_tokens")
        .select("token");

    if (error) {
        console.error("Error fetching push tokens:", error.message);
        return;
    }

    if (!tokens) return;

    // 2️⃣ Filtrar el token del dispositivo actual
    const tokensToSend = tokens
        .map((t) => t.token)
        .filter((t) => t !== tokenToIgnore);

    if (tokensToSend.length === 0) return;

    // 3️⃣ Enviar notificación a cada token
    for (const token of tokensToSend) {
        await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                to: token,
                title: payload.title,
                body: payload.body,
            }),
        });
    }
};
