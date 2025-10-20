# Payment Setup Guide

## New Environment Variables Required

Add these variables to your `.env.local` file:

### WhatsApp Configuration

```
NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/7737879079
```

### Google Pay / UPI Configuration

```
NEXT_PUBLIC_GOOGLE_PAY_QR_URL=https://your-qr-code-image-url.com/qr.png
NEXT_PUBLIC_GOOGLE_PAY_PHONE_NUMBER=yourUPIid@bank
```

Note: Upload your QR code image to Supabase Storage or any image hosting service and use that URL.

### Bank Transfer Configuration

```
NEXT_PUBLIC_BANK_NAME=Your Bank Name
NEXT_PUBLIC_BANK_ACCOUNT_HOLDER_NAME=Account Holder Name
NEXT_PUBLIC_BANK_ACCOUNT_NUMBER=1234567890
NEXT_PUBLIC_BANK_IFSC_CODE=BANK0001234
```

## How It Works

### Buy Now Button

1. User clicks "Buy Now" on product detail page
2. Modal opens with payment method selection (Google Pay/UPI and Bank Transfer)
3. User selects a payment method and proceeds

### Google Pay / UPI Flow

1. QR code is displayed for scanning
2. UPI ID shown below for direct payment via UPI apps
3. User completes payment
4. Confirmation screen asks for:
   - Payment screenshot
   - Transaction number
   - Product ID (shown on screen)
5. "Share on WhatsApp" button redirects to your WhatsApp chat

### Bank Transfer Flow

1. Bank details displayed:
   - Bank Name
   - Account Holder Name
   - Account Number
   - IFSC Code
2. User completes bank transfer
3. Confirmation screen asks for:
   - Payment screenshot
   - Transaction number
   - Product ID (shown on screen)
4. "Share on WhatsApp" button redirects to your WhatsApp chat

### Chat on WhatsApp Button

- Directly opens WhatsApp with pre-filled message about the product
- No payment flow involved

## Features

- Multi-step modal with Back/Next navigation
- Friendly message: "Automated payment gateways will be implemented soon"
- Product ID displayed for user reference
- Clean, intuitive UI matching your app theme
- Dark mode support
- Mobile responsive
