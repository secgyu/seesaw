import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderItem {
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  postalCode: string;
  phone: string;
}

interface OrderEmailData {
  orderNumber: string;
  email: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: ShippingAddress;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const { orderNumber, email, items, subtotal, shippingCost, total, shippingAddress } = data;

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong><br>
          <span style="color: #666; font-size: 14px;">Size: ${item.size} / Color: ${item.color}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toLocaleString()}</td>
      </tr>
    `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background-color: #000000; padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 8px;">SEESAW</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 400;">Order Confirmed</h2>
            <p style="color: #666; margin: 0 0 30px 0;">Thank you for your order!</p>
            
            <div style="background-color: #f9f9f9; padding: 20px; margin-bottom: 30px;">
              <p style="margin: 0; font-size: 14px; color: #666;">Order Number</p>
              <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: 500;">${orderNumber}</p>
            </div>
            
            <!-- Items -->
            <h3 style="font-size: 16px; font-weight: 500; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">Order Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <thead>
                <tr style="background-color: #f9f9f9;">
                  <th style="padding: 12px; text-align: left; font-weight: 500; font-size: 14px;">Item</th>
                  <th style="padding: 12px; text-align: center; font-weight: 500; font-size: 14px;">Qty</th>
                  <th style="padding: 12px; text-align: right; font-weight: 500; font-size: 14px;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <!-- Totals -->
            <div style="border-top: 2px solid #000; padding-top: 20px; margin-bottom: 30px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Subtotal</span>
                <span>$${subtotal.toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #666;">Shipping</span>
                <span>${shippingCost === 0 ? "Free" : `$${shippingCost.toLocaleString()}`}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 500; margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
                <span>Total</span>
                <span>$${total.toLocaleString()}</span>
              </div>
            </div>
            
            <!-- Shipping Address -->
            <h3 style="font-size: 16px; font-weight: 500; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">Shipping Address</h3>
            <div style="background-color: #f9f9f9; padding: 20px;">
              <p style="margin: 0; line-height: 1.6;">
                ${shippingAddress.firstName} ${shippingAddress.lastName}<br>
                ${shippingAddress.address}<br>
                ${shippingAddress.apartment ? `${shippingAddress.apartment}<br>` : ""}
                ${shippingAddress.city}, ${shippingAddress.postalCode}<br>
                ${shippingAddress.phone}
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #000000; padding: 30px 20px; text-align: center;">
            <p style="color: #999; margin: 0 0 10px 0; font-size: 14px;">Questions? Contact us at support@seesaw.com</p>
            <p style="color: #666; margin: 0; font-size: 12px;">© 2025 SEESAW. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: "SEESAW <onboarding@resend.dev>",
      to: email,
      subject: `Order Confirmed - ${orderNumber}`,
      html,
    });

    console.log("Order confirmation email sent:", result);
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    return { success: false, error };
  }
}

export async function sendShippingNotificationEmail(data: {
  orderNumber: string;
  email: string;
  status: "shipped" | "delivered";
  trackingNumber?: string;
}) {
  const { orderNumber, email, status, trackingNumber } = data;

  const statusText =
    status === "shipped" ? "Your order has been shipped!" : "Your order has been delivered!";
  const statusDescription =
    status === "shipped"
      ? "Your order is on its way. You can track your package using the tracking number below."
      : "Your order has been delivered. We hope you love your new items!";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <div style="background-color: #000000; padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 8px;">SEESAW</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 60px; height: 60px; background-color: ${status === "shipped" ? "#3b82f6" : "#22c55e"}; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 30px;">${status === "shipped" ? "📦" : "✓"}</span>
              </div>
              <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 400;">${statusText}</h2>
              <p style="color: #666; margin: 0;">${statusDescription}</p>
            </div>
            
            <div style="background-color: #f9f9f9; padding: 20px; margin-bottom: 20px;">
              <p style="margin: 0; font-size: 14px; color: #666;">Order Number</p>
              <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: 500;">${orderNumber}</p>
            </div>
            
            ${
              trackingNumber
                ? `
            <div style="background-color: #f9f9f9; padding: 20px;">
              <p style="margin: 0; font-size: 14px; color: #666;">Tracking Number</p>
              <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: 500;">${trackingNumber}</p>
            </div>
            `
                : ""
            }
          </div>
          
          <!-- Footer -->
          <div style="background-color: #000000; padding: 30px 20px; text-align: center;">
            <p style="color: #999; margin: 0 0 10px 0; font-size: 14px;">Questions? Contact us at support@seesaw.com</p>
            <p style="color: #666; margin: 0; font-size: 12px;">© 2025 SEESAW. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: "SEESAW <onboarding@resend.dev>",
      to: email,
      subject:
        status === "shipped"
          ? `Your Order ${orderNumber} Has Shipped!`
          : `Your Order ${orderNumber} Has Been Delivered!`,
      html,
    });

    console.log("Shipping notification email sent:", result);
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send shipping notification email:", error);
    return { success: false, error };
  }
}
