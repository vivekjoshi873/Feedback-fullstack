import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerficationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resending.dev",
      to: "email",
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
