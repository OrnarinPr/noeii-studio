import { apiJson } from "@/services/api";

export async function adminLogin(
  passcode: string,
  otp: string
): Promise<{ token: string }> {
  return apiJson<{ token: string }>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({
      passcode,
      otp,
    }),
  });
}
