/**
 * Excerpt: honeypot “discarded” flow (consultation).
 * Non-empty honeypot field `website` → status `discarded`.
 * Caller returns a success-shaped HTTP response and skips persist/email (ADR 0006).
 */

export type FormState = {
  status: "idle" | "success" | "error" | "discarded";
  delivered?: boolean;
  message?: string;
};

export function processHoneypot(website: string, thanksMessage: string): FormState | null {
  if (website.length > 0) {
    return { status: "discarded", delivered: true, message: thanksMessage };
  }
  return null;
}

/** API / action caller — fake success before persist and email. */
export function respondAfterProcess(result: FormState) {
  if (result.status === "discarded") {
    // Same fake success the bot already expects — do not persist or send email.
    return {
      status: "success" as const,
      delivered: result.delivered,
      message: result.message,
    };
  }
  return result;
}
