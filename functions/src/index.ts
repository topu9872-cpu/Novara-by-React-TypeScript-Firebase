import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
dotenv.config();

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);



app.post("/createCheckoutSession", async (req, res) => {
  try {
    const { product, email, displayName, userId, phoneNumber } = req.body;

    if (!product?.length || !email || !userId) {
      return res.status(400).json({
        success: false,
        message: "Product, email and userId are required.",
      });
    }

    const lineItems = product.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: Number(item.quantity || 1),
    }));

    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Priority Shipping",
        },
        unit_amount: 500,
      },
      quantity: 1,
    });

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
        products: JSON.stringify(product),
      },

      success_url:
        `${process.env.FRONTEND_URL}/payment-success` +
        `?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
    });

    return res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Payment failed.",
    });
  }
});

app.get("/verifyCheckoutSession", async (req, res) => {
  try {
    const sessionId = req.query.session_id as string;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required.",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment has not been completed.",
      });
    }

    const products = JSON.parse(session.metadata?.products || "[]").map(
      (product: any) => ({
        ...product,
        sessionId: session.id,
      }),
    );

    const orderData = {
      userId: session.metadata?.userId || "",
      sessionId: session.id,
      email: session.customer_email || session.metadata?.email || "",
      displayName: session.metadata?.displayName || "",
      phoneNumber: session.metadata?.phoneNumber || "",
      amount: (session.amount_total || 0) / 100,
      currency: session.currency || "usd",
      paymentStatus: session.payment_status,
      products,
      createdAt: new Date().toISOString()
    };

  

    return res.json({
      success: true,
      ...orderData,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Verification failed.",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// export default app;