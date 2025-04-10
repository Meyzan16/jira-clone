
import { useMemo } from "react";

export function generateInviteCode(length:number) {
    const characters = "ABCDEFGHIJKLMNOPWRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i=0; i < length; i++){
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    return result;
}

export function getFormikError(error: unknown): string | undefined {
  if (Array.isArray(error)) {
    // Kalau error array, ambil error pertama
    return error[0];
  }
  if (typeof error === "string") {
    return error;
  }
  return undefined;
}