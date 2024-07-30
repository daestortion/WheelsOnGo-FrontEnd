import React, { useRef, useEffect } from "react";
import "../Css/PayPal.css"; // Import the CSS file

export default function PayPal({ totalPrice, onSuccess, onError }) {
  const paypal = useRef();

  useEffect(() => {
    if (!paypal.current || paypal.current.innerHTML !== "") return;

    window.paypal
      .Buttons({
        style: {
          shape: "pill",
          layout: "horizontal",
          color: "gold",
          label: "pay",
          tagline: "false"
        },
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "Car rental payment",
                amount: {
                  currency_code: "USD",
                  value: totalPrice.toFixed(2),
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          console.log(order);
          onSuccess(order);
        },
        onError: (err) => {
          console.error("PayPal Error:", err); // Ensure error is logged
          onError(err);
        },
      })
      .render(paypal.current);
  }, [totalPrice, onSuccess, onError]);
  return (
    <div className="paypal-button-container">
      <div ref={paypal}></div>
    </div>
  );
}
