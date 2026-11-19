/**
 * Excerpt: honeypot “discarded” flow (consultation).
 * Non-empty honeypot field `website` → status `discarded`.
 * API maps that to a success-shaped HTTP response and skips persist/email (ADR 0006).
 */

type FormState = {
  status: "idle" | "success" | "error" | "discarded";
  delivered?: boolean;
  message?: string;
};

function processHoneypot(website: string, thanksMessage: string): FormState | null {
  if (website.length > 0) {
    return { status: "discarded", delivered: true, message: thanksMessage };
  }
  return null;
}

function apiResponseForDiscarded(result: FormState) {
  // Same fake success the bot already expects — do not persist.
  return {
    status: "success" as const,
    delivered: result.delivered,
    message: result.message,
  };
}

void processHoneypot;
void apiResponseForDiscarded;
