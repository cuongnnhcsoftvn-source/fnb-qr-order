import QRCode from "qrcode.react";

export default function TableQR({ tableId }) {
  const url = `https://fnb-customer.vercel.app?tableId=${tableId}`;
  return (
    <div>
      <h3>Bàn {tableId}</h3>
      <QRCode value={url} size={200} />
    </div>
  )
}
