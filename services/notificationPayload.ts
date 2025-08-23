interface TransactionNotificationPayload {
    user: string; // quien hace la acción
    action: "added" | "edited" | "deleted";
    description: string;
    amount?: number;
}

export const buildNotificationPayload = (data: TransactionNotificationPayload) => {
    let body = "";
    switch (data.action) {
        case "added":
            body = `${data.user} ha añadido la transacción: ${data.description}${data.amount ? " - " + data.amount + "€" : ""}`;
            break;
        case "edited":
            body = `${data.user} ha editado la transacción: ${data.description}${data.amount ? " - " + data.amount + "€" : ""}`;
            break;
        case "deleted":
            body = `${data.user} ha eliminado la transacción: ${data.description}${data.amount ? " - " + data.amount + "€" : ""}`;
            break;
    }

    return {
        title: "Actividad en MyMoney3",
        body,
    };
};
