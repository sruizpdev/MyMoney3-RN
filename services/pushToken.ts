// services/pushToken.ts
let token: string | null = null;

export const setPushToken = (t: string) => {
    token = t;
};

export const getPushToken = (): string | null => token;
