import { redirect } from "next/navigation";
import { stripe } from "../lib/stripe";

export default async function Return({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const session_id = resolvedSearchParams.session_id;

  if (!session_id || typeof session_id !== "string") {
    return (
      <section className="bg-[#1e1e1e] px-6 py-20 text-center text-[#f5f5f5]">
        <p className="mx-auto max-w-xl text-lg">
          Missing or invalid session ID. Please try again or contact support.
        </p>
      </section>
    );
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent", "customer_details"],
  });

  const customerEmail =
    session.customer_details?.email ?? session.customer_email;

  switch (session.status) {
    case "open":
      return redirect("/");

    case "complete":
      if (session.payment_status === "paid") {
        return (
          <section className="bg-[#1e1e1e] px-6 py-20 text-center text-[#f5f5f5]">
            <p className="mx-auto max-w-xl text-lg">
              We appreciate your business! A confirmation email will be sent to{" "}
              <span className="font-semibold">{customerEmail}</span>. If you
              have any questions, please email{" "}
              <a
                href="mailto:orders@dndscrybe.com"
                className="font-semibold text-[#df2935] hover:text-[#b2222b]"
              >
                orders@dndscrybe.com
              </a>
              .
            </p>
          </section>
        );
      } else {
        return (
          <section className="bg-[#1e1e1e] px-6 py-20 text-center text-[#f5f5f5]">
            <p className="mx-auto max-w-xl text-lg">
              Your payment was not successful. Please try again or contact
              support.
            </p>
          </section>
        );
      }

    case "expired":
      return (
        <section className="bg-[#1e1e1e] px-6 py-20 text-center text-[#f5f5f5]">
          <p className="mx-auto max-w-xl text-lg">
            Your session has expired. Please initiate the checkout process
            again.
          </p>
        </section>
      );

    default:
      return (
        <section className="bg-[#1e1e1e] px-6 py-20 text-center text-[#f5f5f5]">
          <p className="mx-auto max-w-xl text-lg">
            Unexpected session status. Please contact support.
          </p>
        </section>
      );
  }
}
