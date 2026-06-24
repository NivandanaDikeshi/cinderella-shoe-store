export const generatePayment = (
  order: any
) => {
  return {
    sandbox: true,

    merchant_id:
      process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID,

    return_url:
      "http://localhost:3000/checkout/success",

    cancel_url:
      "http://localhost:3000/checkout",

    notify_url:
      "http://localhost:3000/api/payhere",

    order_id:
      order.orderNumber,

    items:
      "Cinderella Shoe Store Order",

    amount:
      order.total.toFixed(2),

    currency: "LKR",

    first_name:
      order.customerName,

    email:
      order.email,

    phone:
      order.phone,

    address:
      order.address,

    city:
      order.city,

    country:
      "Sri Lanka",
  };
};