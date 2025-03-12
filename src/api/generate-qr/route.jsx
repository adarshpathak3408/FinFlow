import QRCode from "qrcode"

export async function POST(request) {
  try {
    const data = await request.json()
    const { upiId, amount, payeeName, note } = data

    // Format: upi://pay?pa=UPI_ID&pn=PAYEE_NAME&am=AMOUNT&cu=CURRENCY&tn=TRANSACTION_NOTE
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(upiLink)

    return new Response(
      JSON.stringify({
        success: true,
        qrCode: qrCodeDataUrl,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to generate QR code",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

