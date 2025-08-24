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
        // Obtener todos los tokens de la tabla, evitando nulos
        const { data: tokens, error } = await supabase
            .from("push_tokens")
            .select("token")
            .not("token", "is", null);

        if (error || !tokens || tokens.length === 0) return;

        // Filtrar el token del dispositivo actual
        const tokensToSend = tokens
            .flatMap(t => t.token ? [t.token] : [])
            .filter(t => t !== tokenToIgnore);
        if (tokensToSend.length === 0) return;

        // Enviar notificación en paralelo
        await Promise.all(
            tokensToSend.map(token =>
                fetch("https://exp.host/--/api/v2/push/send", {
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
                })
            )
        );
    } catch {
        // Se ignoran errores silenciosamente
    }
};
