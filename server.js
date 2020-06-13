const express = require("express");
const app = express();
const { resolve } = require("path");

// load env variables
require('dotenv').config();

// This is your real test secret API key.
const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY);

app.use(express.static("."));
app.use(express.json());

const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 150000;
};

const chargeCustomer = async (customerId) => {
  // Lookup the payment methods available for the customer
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: "card"
  });

  // Charge the customer and payment method immediately
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: "usd",
    customer: customerId,
    payment_method: paymentMethods.data[0].id,
    off_session: true,
    confirm: true
  });

  if (paymentIntent.status === "succeeded") {
    console.log("✅ Successfully charged card off session");
  }
}

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  console.log(req.body);
  // Alternatively, set up a webhook to listen for the payment_intent.succeeded event
  // and attach the PaymentMethod to a new Customer
  const customer = await stripe.customers.create(
    {
      email: 'test+reactstripe@gmail.com',
    }
  );
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    customer: customer.id,
    setup_future_usage: 'off_session',
    amount: calculateOrderAmount(items),
    currency: "usd"
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  });
});

app.listen(4242, () => console.log('Node server listening on port 4242!'));
