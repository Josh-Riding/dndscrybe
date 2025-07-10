import { Resend } from "resend";
import { welcomeEmailHtml } from "./template";
import { purchaseConfirmationEmailHtml } from "./template";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async (to: string) => {
  await resend.emails.send({
    from: "DND Scrybe <welcome@dndscrybe.com>",
    to,
    subject: "Hail, Adventurer! Welcome to DND Scrybe 🐉",
    html: welcomeEmailHtml,
  });
};

export const sendPurchaseEmail = async (
  to: string,
  name: string,
  credits: number,
) => {
  await resend.emails.send({
    from: "DND Scrybe <orders@dndscrybe.com>",
    to,
    subject: `You Leveled Up!`,
    html: purchaseConfirmationEmailHtml(name, credits),
  });
};
