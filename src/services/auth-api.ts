import { initializeApp } from "firebase/app";
import { getAuth, Auth, signInWithEmailAndPassword, AuthError } from "firebase/auth";

import Result from "../utils/result";
import type { ErrorResponse } from "../types/error-response";

const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const FIREBASE_AUTH_DOMAIN = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const FIREBASE_PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const FIREBASE_STORAGE_BUCKET = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const FIREBASE_MESSAGING_SENDER_ID = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const FIREBASE_APP_ID = import.meta.env.VITE_FIREBASE_APP_ID;
const FIREBASE_MEASUREMENT_ID = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;

export default class AuthApi {
  private readonly client: Auth;

  constructor() {
    const firebaseApp = initializeApp({
      apiKey: FIREBASE_API_KEY,
      authDomain: FIREBASE_AUTH_DOMAIN,
      projectId: FIREBASE_PROJECT_ID,
      storageBucket: FIREBASE_STORAGE_BUCKET,
      messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
      appId: FIREBASE_APP_ID,
      measurementId: FIREBASE_MEASUREMENT_ID,
    });

    this.client = getAuth(firebaseApp);
  }

  public async signIn(email: string, password: string): Promise<Result<string, ErrorResponse>> {
    try {
      const response = await signInWithEmailAndPassword(this.client, email, password);

      return Result.ok(await response.user.getIdToken());
    } catch (err) {
      const authError = err as AuthError;
      const errorResponse: ErrorResponse = {
        message: authError.message,
        status: 400,
      };

      return Result.err(errorResponse);
    }
  }
}
