import React from 'react';

const RefundAndReturnPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8"  style={{marginTop:'4rem'}}>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Refund and Return Policy
      </h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Overview</h2>
        <div className="space-y-4 text-gray-600">
          <p>
            We want you to be fully satisfied with your purchase. If you are not satisfied, we offer a straightforward process for returns and refunds.
          </p>
          <p>
            Please review our policy below for detailed information on how to request a return or refund.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Return & Refund Timeline</h2>
        <ul className="space-y-3 text-gray-600 list-none">
          <li className="flex gap-2">
            <span className="font-semibold">Return Period:</span>
            You have <span className="font-semibold">30 days</span> from the date of purchase to initiate a return.
          </li>
          <li className="flex gap-2">
            <span className="font-semibold">Refund Process:</span>
            Refund requests will be processed within <span className="font-semibold">7 business days</span> after the return is approved.
          </li>
          <li className="flex gap-2">
            <span className="font-semibold">Processing Time:</span>
            Refunds to your original payment method may take up to <span className="font-semibold">10 business days</span> depending on your bank or payment provider.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Return Eligibility</h2>
        <p className="text-gray-600">In order for your return to be eligible, the following conditions must be met:</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>The product must be unused, in the original packaging, and in resellable condition.</li>
          <li>Items marked as "Final Sale" or "Non-Returnable" cannot be returned or refunded.</li>
          <li>Return requests must be made within 30 days of purchase.</li>
          <li>Proof of purchase (order number or receipt) is required to process returns or refunds.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">How to Request a Return or Refund</h2>
        <p className="text-gray-600">To initiate a return or refund, please follow these steps:</p>
        <ol className="list-decimal pl-6 space-y-2 text-gray-600">
          <li>Contact our customer support team at <span className="font-semibold">support@socialswap.in</span> with your order details and the reason for the return.</li>
          <li>Our team will review your request and provide return instructions if your return is eligible.</li>
          <li>Once the item is received and inspected, we will notify you of the approval or rejection of your refund.</li>
          <li>If your return is approved, your refund will be processed and applied to your original payment method.</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Exceptions</h2>
        <p className="text-gray-600">In the following cases, returns or refunds may not be accepted:</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>Products that have been used or altered from their original condition.</li>
          <li>Items returned after the 30-day return window has passed.</li>
          <li>Products that are not purchased directly from our website (e.g., third-party vendors or resellers).</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Exchanges</h2>
        <p className="text-gray-600">
          We currently do not offer direct exchanges. If you would like to exchange a product, please follow the return process to receive a refund and then place a new order for the desired product.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Shipping Costs</h2>
        <p className="text-gray-600">
          Customers are responsible for return shipping costs unless the product is defective or an error was made in the order. In cases where the product is defective or incorrect, we will cover the return shipping costs.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Contact Us</h2>
        <p className="text-gray-600">If you have any questions about this Refund and Return Policy, please contact us:</p>
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

export default RefundAndReturnPolicy;