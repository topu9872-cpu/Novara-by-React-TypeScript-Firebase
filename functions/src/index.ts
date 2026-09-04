import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import Stripe from "stripe";
import cors from "cors";

setGlobalOptions({
  maxInstances: 10,
});

const corsHandler = cors({
  origin: true,
});

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not configured.");
}

const stripe = new Stripe(stripeSecretKey);

export const createCheckoutSession = onRequest(
  {
    region: "asia-southeast1",
  },
  async (req, res) => {
    corsHandler(req, res, async () => {
      try {
        // -----------------------------------------
        // METHOD CHECK
        // -----------------------------------------
        if (req.method !== "POST") {
          res.status(405).json({
            success: false,
            message: "Method not allowed",
          });
          return;
        }

        // -----------------------------------------
        // REQUEST DATA
        // -----------------------------------------

        const {
          productName,
          productPrice,
          quantity = 1,
          email,
          displayName,
        } = req.body;

        // -----------------------------------------
        // VALIDATE PRODUCT
        // -----------------------------------------

        if (!productName || productPrice === undefined) {
          res.status(400).json({
            success: false,
            message: "Product name and price are required.",
          });
          return;
        }

        // -----------------------------------------
        // VALIDATE EMAIL
        // -----------------------------------------

        if (!email || typeof email !== "string") {
          res.status(400).json({
            success: false,
            message: "User email is required.",
          });
          return;
        }

        // -----------------------------------------
        // PRICE & QUANTITY
        // -----------------------------------------

        const price = Number(productPrice);
        const qty = Number(quantity);

        if (!Number.isFinite(price) || price <= 0) {
          res.status(400).json({
            success: false,
            message: "Invalid product price.",
          });
          return;
        }

        if (!Number.isInteger(qty) || qty <= 0) {
          res.status(400).json({
            success: false,
            message: "Invalid quantity.",
          });
          return;
        }

        // -----------------------------------------
        // FRONTEND URL
        // -----------------------------------------

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

        // -----------------------------------------
        // CREATE STRIPE CHECKOUT SESSION
        // -----------------------------------------

        const session = await stripe.checkout.sessions.create({
          mode: "payment",

          payment_method_types: ["card"],

          // Automatically fills Stripe's
          // Contact information → Email field
          customer_email: email,

          line_items: [
            {
              price_data: {
                currency: "usd",

                product_data: {
                  name: String(productName),
                },

                unit_amount: Math.round(price * 100),
              },

              quantity: qty,
            },
          ],

          // -----------------------------------------
          // USER / ORDER METADATA
          // -----------------------------------------

          metadata: {
            price: String(price),

            quantity: String(qty),

            productName: String(productName),

            email: email,

            displayName: displayName ? String(displayName) : "",
          },

          // -----------------------------------------
          // SUCCESS URL
          // -----------------------------------------

          success_url:
            `${frontendUrl}/payment-success` +
            `?session_id={CHECKOUT_SESSION_ID}`,

          // -----------------------------------------
          // CANCEL URL
          // -----------------------------------------

          cancel_url: `${frontendUrl}/checkout`,
        });

        // -----------------------------------------
        // RESPONSE
        // -----------------------------------------

        res.status(200).json({
          success: true,

          sessionId: session.id,

          url: session.url,
        });
      } catch (error) {
        console.error("Stripe Checkout Error:", error);

        res.status(500).json({
          success: false,
          message: "Unable to create Stripe checkout session.",
        });
      }
    });
  },
);

export const verifyCheckoutSession = onRequest(
  {
    region: "asia-southeast1",
  },
  async (req, res) => {
    corsHandler(req, res, async () => {
      try {
        if (req.method !== "GET") {
          res.status(405).json({
            success: false,
            message: "Method not allowed",
          });
          return;
        }

        const sessionId = req.query.session_id;

        if (!sessionId || typeof sessionId !== "string") {
          res.status(400).json({
            success: false,
            message: "Stripe session ID is required.",
          });
          return;
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== "paid") {
          res.status(400).json({
            success: false,
            message: "Payment has not been completed.",
          });
          return;
        }

        res.status(200).json({
          success: true,

          sessionId: session.id,

          email:
            session.customer_details?.email ||
            session.customer_email ||
            session.metadata?.email ||
            "",

          displayName:
            session.metadata?.displayName ||
            session.customer_details?.name ||
            "",

          amount: session.amount_total ? session.amount_total / 100 : 0,

          currency: session.currency || "usd",

          paymentStatus: session.payment_status,
        });
      } catch (error) {
        console.error("Stripe Verify Error:", error);

        res.status(500).json({
          success: false,
          message: "Unable to verify Stripe payment.",
        });
      }
    });
  },
);
