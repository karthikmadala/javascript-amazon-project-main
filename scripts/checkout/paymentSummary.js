import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import formatCurrency from "../utils/money.js";

export function renderPaymentSummary() {
  // Initialize total variables
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let itemCount = 0;

  // Calculate totals from cart
  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    if (product) {
      productPriceCents += product.priceCents * cartItem.quantity;
      itemCount += cartItem.quantity;
    }

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    if (deliveryOption) {
      shippingPriceCents += deliveryOption.priceCents;
    }
  });

  // Calculate taxes and total
  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = Math.round(totalBeforeTaxCents * 0.1); // Assuming 10% tax
  const totalCents = totalBeforeTaxCents + taxCents;

  // Generate payment summary HTML
  const paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${itemCount}):</div>
      <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
    </div>

    <button class="place-order-button button-primary">
      Place your order
    </button>
  `;

  // Update the DOM
  const paymentSummaryContainer = document.querySelector('.js-payment-summary');
  if (paymentSummaryContainer) {
    paymentSummaryContainer.innerHTML = paymentSummaryHTML;
  } else {
    console.error("Payment summary container not found.");
  }
}
