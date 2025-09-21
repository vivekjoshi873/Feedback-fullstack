import { getResendClient } from "@/lib/resend";
import VerificationEmail from "../../emails/VerficationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    let resendClient;
    try {
      resendClient = getResendClient();
    } catch (err) {
      // If there's no API key, avoid crashing the whole request. In development
      // we can skip sending the email and return success so flows continue.
  const errMsg = err instanceof Error ? err.message : String(err);
  console.warn("Resend client not available:", errMsg);
      if (process.env.NODE_ENV === "production") {
        return { success: false, message: "Missing email provider configuration" };
      }
      return { success: true, message: "Email sending skipped in development" };
    }

    await resendClient.emails.send({
      from: "onboarding@resending.dev",
      to: email,
      subject: "Feedback Message | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return {
      success: true,
      message: "Successfully send the verification email",
    };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return { success: false, message: "failed to send the verification email" };
  }
}
