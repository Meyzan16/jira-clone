"use server";

import { createAdminClient } from "@/lib/appwrite";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { OAuthProvider } from "node-appwrite";

export async function signUpWithGithub() {
	const { account } = await createAdminClient();

    const origin = headers().get("origin") ?? process.env.NEXT_PUBLIC_APP_URL!;

    console.log(origin);
    //http://localhost:3000

	// returns Promise<string>
    const redirectUrl = await account.createOAuth2Token(
		OAuthProvider.Github,
		`${process.env.NEXT_PUBLIC_APP_URL}/oauth`,
		`${process.env.NEXT_PUBLIC_APP_URL}/sign-up`,
	);

    return redirect(redirectUrl);
};
