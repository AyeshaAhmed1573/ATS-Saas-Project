import Stripe from "stripe";
import Organization from "../models/Organization.js";

// Billing is wired end-to-end but ships in "test mode": drop in real Stripe
// keys in .env and this becomes a working subscription flow with no code changes.
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const createCheckoutSession = async (req, res) => {
  if (!stripe) {
    return res.status(501).json({
      message: "Billing isn't configured yet. Add STRIPE_SECRET_KEY to .env to enable it.",
    });
  }
  try {
    const org = await Organization.findById(req.user.organization);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: req.user.email,
      line_items: [{ price: process.env.STRIPE_PRICE_ID_PRO, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/billing?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/billing?canceled=true`,
      metadata: { organizationId: org._id.toString() },
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: "Could not start checkout", error: err.message });
  }
};

export const stripeWebhook = async (req, res) => {
  if (!stripe) return res.status(501).send("Billing not configured");

  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook signature error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orgId = session.metadata?.organizationId;
    if (orgId) {
      await Organization.findByIdAndUpdate(orgId, {
        plan: "pro",
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;
    await Organization.findOneAndUpdate(
      { stripeSubscriptionId: sub.id },
      { plan: "free" }
    );
  }

  res.json({ received: true });
};

export const getBillingStatus = async (req, res) => {
  const org = await Organization.findById(req.user.organization);
  res.json({ plan: org.plan, seatsUsed: org.seatsUsed, billingEnabled: !!stripe });
};
