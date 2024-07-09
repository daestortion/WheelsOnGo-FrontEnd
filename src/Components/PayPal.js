import React, { useRef, useEffect } from "react";
import "../Css/PayPal.css"; // Import the CSS file

export default function PayPal({ totalPrice }) {
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
                  value: totalPrice.toFixed(2), // Ensure totalPrice is used here
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          console.log(order);
        },
        onError: (err) => {
          console.log(err);
        },
      })
      .render(paypal.current);
  }, [totalPrice]);

  return (
    <div className="paypal-button-container">
      <div ref={paypal}></div>
    </div>
  );
}
