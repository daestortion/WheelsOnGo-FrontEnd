import React, { useRef, useEffect } from "react";
import axios from 'axios';
import "../Css/PayPal.css"; // Import the CSS file

export default function PayPal({ totalPrice, onSuccess, onError, order, userId, carId }) {
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
          const paypalOrder = await actions.order.capture();
          console.log(paypalOrder);

          try {
            const formData = new FormData();
            const updatedOrder = {
              ...order,
              referenceNumber: paypalOrder.id,
              payment: { method: 'PayPal', details: paypalOrder }
            };
            formData.append('order', new Blob([JSON.stringify(updatedOrder)], { type: 'application/json' }));
            
            console.log(updatedOrder.status);

            const response = await axios.post(`http://localhost:8080/order/insertOrder?userId=${userId}&carId=${carId}`, formData, {
            
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });

            if (response.data) {
              onSuccess(response.data);
            }
          } catch (error) {
            onError(error);
          }
        },
        onError: (err) => {
          console.error("PayPal Error:", err); // Ensure error is logged
          onError(err);
        },
      })
      .render(paypal.current);
  }, [totalPrice, onSuccess, onError, order, userId, carId]);

  return (
    <div className="paypal-button-container">
      <div ref={paypal}></div>
    </div>
  );
}
