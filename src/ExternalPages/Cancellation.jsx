import React from 'react';

const ShippingAndCancellationPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12 mt-4 "  style={{marginTop:'2rem'}}>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Shipping and Cancellation Policy
      </h1>

      <section className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Shipping Policy</h2>
          <p className="text-gray-600">
            We are committed to delivering your order in a timely manner. Please read the following information regarding our shipping policy.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Shipping Methods and Costs</h3>
          <p className="text-gray-600">We offer the following shipping options for all orders:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>
              <span className="font-semibold">Standard Shipping: </span>
              Delivered within 5-7 business days. (Free for orders over ₹500)
            </li>
            <li>
              <span className="font-semibold">Express Shipping: </span>
              Delivered within 2-3 business days. (Additional charges apply)
            </li>
            <li>
              <span className="font-semibold">International Shipping: </span>
              Delivery time varies by country. Additional shipping charges apply.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Shipping Confirmation and Order Tracking</h3>
          <p className="text-gray-600">
            Once your order has been shipped, you will receive a shipping confirmation email with tracking details. You can track your order using the provided tracking number.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Shipping Restrictions</h3>
          <p className="text-gray-600">
            We currently do not ship to P.O. Boxes, APO, or FPO addresses. We also have shipping limitations for certain international destinations. Please contact customer support if you have any questions regarding shipping restrictions.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">International Shipping</h3>
          <p className="text-gray-600">
            If you are ordering from outside of India, please note that shipping times and costs may vary based on your location. Duties and taxes for international shipments are the responsibility of the customer.
          </p>
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Cancellation Policy</h2>
          <p className="text-gray-600">
            We understand that sometimes plans change. If you need to cancel your order, please follow the steps below:
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">How to Cancel an Order</h3>
          <p className="text-gray-600">
            You may cancel your order by contacting our customer service team at <span className="font-semibold">support@socialswap.in</span> as long as the order has not been processed or shipped. To cancel an order:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-gray-600">
            <li>Send an email to <span className="font-semibold">support@socialswap.in</span> with your order number and cancellation request.</li>
            <li>If the order has not yet been processed, we will confirm the cancellation and process your refund.</li>
            <li>If the order has already been shipped, it cannot be cancelled. However, you can return the item once it is delivered.</li>
          </ol>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Cancellation Time Frame</h3>
          <p className="text-gray-600">
            Orders can be cancelled within 24 hours of placing the order. After 24 hours, cancellation will depend on the status of the order (whether it has been processed or shipped).
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Non-Cancellable Orders</h3>
          <p className="text-gray-600">The following types of orders cannot be cancelled:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Custom or personalized products</li>
            <li>Items purchased during promotional sales or flash sales</li>
            <li>Final sale or clearance items</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Refunds for Cancelled Orders</h3>
          <p className="text-gray-600">
            If your cancellation request is approved, the refund will be processed within 5-7 business days, depending on your payment method. Refunds will be credited to your original payment method (credit card, debit card, or other payment options).
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Partial Cancellation</h3>
          <p className="text-gray-600">
            If you want to cancel part of your order, you must contact us before the entire order is shipped. If only part of the order has been shipped, we will refund the price of the items that have not been shipped.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Contact Us</h2>
        <p className="text-gray-600">
          If you have any questions about our Shipping and Cancellation Policy, please feel free to reach out:
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Email: </span>
          <a href="mailto:support@socialswap.in" className="text-blue-600 hover:text-blue-800 underline">
            support@socialswap.in
          </a>
        </p>
      </section>
    </div>
  );
};

export default ShippingAndCancellationPolicy;