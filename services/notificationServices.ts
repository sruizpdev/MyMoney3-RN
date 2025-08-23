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
    try {
        // 1️⃣ Obtener todos los tokens de la tabla, evitando nulos
        const { data: tokens, error } = await supabase
            .from("push_tokens")
            .select("token")
            .not("token", "is", null);

        if (error) {
            console.error("Error fetching push tokens:", error.message);
            return;
        }

        if (!tokens || tokens.length === 0) return;

        // 2️⃣ Filtrar el token del dispositivo actual
        const tokensToSend = tokens
            .flatMap(t => t.token ? [t.token] : [])
            .filter(t => t !== tokenToIgnore);


        console.log("Tokens desde Supabase:", tokens);
        console.log("Tokens a enviar después de filtrar:", tokensToSend);

        if (tokensToSend.length === 0) return;

        // 3️⃣ Enviar notificación en paralelo
        await Promise.all(
            tokensToSend.map(async token => {
                try {
                    const response = await fetch("https://exp.host/--/api/v2/push/send", {
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
                    console.log("Respuesta de Expo Push:", await response.text());
                    if (!response.ok) {
                        console.error("Error sending push to", token, await response.text());
                    }
                } catch (err) {
                    console.error("Network error sending push to", token, err);
                }
            })
        );
    } catch (err) {
        console.error("Unexpected error in sendPushNotificationToOthers:", err);
    }
};
