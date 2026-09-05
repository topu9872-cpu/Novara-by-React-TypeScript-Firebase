import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import Stripe from "stripe";
import cors from "cors";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

initializeApp();

const db = getFirestore();

setGlobalOptions({ maxInstances: 10 });

const corsHandler = cors({ origin: true });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not configured.");
}

const stripe = new Stripe(stripeSecretKey);

export const createCheckoutSession = onRequest(
  { region: "asia-southeast1" ,cors: true,},
  async (req, res) => {
    corsHandler(req, res, async () => {
      try {
        if (req.method !== "POST") {
          res.status(405).json({
            success: false,
            message: "Method not allowed",
          });
          return;
        }

        const { product, email, displayName, userId, phoneNumber } = req.body;

        if (!Array.isArray(product) || !product.length) {
          res.status(400).json({
            success: false,
            message: "Products are required.",
          });
          return;
        }

        if (!email) {
          res.status(400).json({
            success: false,
            message: "Email is required.",
          });
          return;
        }

        if (!userId) {
          res.status(400).json({
            success: false,
            message: "User ID is required.",
          });
          return;
        }

        const lineItems = product.map((item: any) => {
          const name = String(item?.name || "").trim();
          const price = Number(item?.price);
          const quantity = Number(item?.quantity || 1);

          if (!name) throw new Error("Product name is missing.");
          if (!Number.isFinite(price) || price <= 0) {
            throw new Error(`Invalid price for product: ${name}`);
          }
          if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new Error(`Invalid quantity for product: ${name}`);
          }

          return {
            price_data: {
              currency: "usd",
              product_data: { name },
              unit_amount: Math.round(price * 100),
            },
            quantity,
          };
        });

        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: { name: "Priority Shipping" },
            unit_amount: 500,
          },
          quantity: 1,
        });

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          payment_method_types: ["card"],
          customer_email: email,
          line_items: lineItems,

          metadata: {
            userId: String(userId),
            email: String(email),
            displayName: String(displayName || ""),
            phoneNumber: String(phoneNumber || ""),
            products: JSON.stringify(
              product.map((item: any) => ({
                id: item.id || item._id || "",
                name: item.name || "",
                price: Number(item.price) || 0,
                quantity: Number(item.quantity || 1),
                image: item.image || "",
              })),
            ),
          },

          success_url:
            `${frontendUrl}/payment-success` +
            `?session_id={CHECKOUT_SESSION_ID}`,

          cancel_url: `${frontendUrl}/checkout`,
        });

        res.status(200).json({
          success: true,
          sessionId: session.id,
          url: session.url,
        });
      } catch (error) {
        console.error("Stripe Checkout Error:", error);

        res.status(500).json({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Unable to create Stripe checkout session.",
        });
      }
    });
  },
);

export const verifyCheckoutSession = onRequest(
  { region: "asia-southeast1" ,cors: true,},
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

        let products: any[] = [];

        try {
          products = session.metadata?.products
            ? JSON.parse(session.metadata.products)
            : [];
        } catch {
          console.error("Product JSON parse error");
        }

        const userId = session.metadata?.userId || "";

        const email =
          session.customer_email ||
          session.customer_details?.email ||
          session.metadata?.email ||
          "";

        const displayName =
          session.metadata?.displayName || session.customer_details?.name || "";

        const phoneNumber = session.metadata?.phoneNumber || "";

        const amount = session.amount_total ? session.amount_total / 100 : 0;

        const currency = session.currency || "usd";

        const orderData = {
          userId,
          sessionId: session.id,
          email,
          displayName,
          phoneNumber,
          amount,
          currency,
          paymentStatus: session.payment_status,
          products,
          createdAt: FieldValue.serverTimestamp(),
        };

        const orderRef = db.collection("orders").doc(session.id);

        const existingOrder = await orderRef.get();

        if (!existingOrder.exists) {
          await orderRef.set(orderData);
        }

        res.status(200).json({
          success: true,
          sessionId: session.id,
          email,
          displayName,
          phoneNumber,
          userId,
          amount,
          currency,
          paymentStatus: session.payment_status,
          products,
        });
      } catch (error) {
        console.error("Stripe Verify Error:", error);

        res.status(500).json({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Unable to verify Stripe payment.",
        });
      }
    });
  },
);
