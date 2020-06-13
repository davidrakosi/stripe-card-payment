import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import "./App.css";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// loadStripe is initialized with your real test publishable API key.
const promise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export default function App() {
  return (
    <div className="App">
      <Elements stripe={promise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
