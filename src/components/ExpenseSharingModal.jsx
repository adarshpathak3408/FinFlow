"use client";

import { useState, useContext, useRef } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { X, Copy, Check, Send, Share, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react"; // Updated import

export default function ExpenseSharingModal({ transaction, onClose }) {
  const { currency } = useContext(TransactionContext);

  const [friends, setFriends] = useState([{ id: 1, name: "", email: "", share: 0 }]);

  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const qrRef = useRef(null);

  // Format currency for display
  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    return formatter.format(amount);
  };

  // Add a new friend
  const addFriend = () => {
    const newId = friends.length > 0 ? Math.max(...friends.map((f) => f.id)) + 1 : 1;
    setFriends([...friends, { id: newId, name: "", email: "", share: 0 }]);
  };

  // Remove a friend
  const removeFriend = (id) => {
    setFriends(friends.filter((friend) => friend.id !== id));
  };

  // Handle friend input changes
  const handleFriendChange = (id, field, value) => {
    setFriends(friends.map((friend) => (friend.id === id ? { ...friend, [field]: value } : friend)));
  };

  // Split expense equally
  const splitEqually = () => {
    const share = transaction.amount / (friends.length + 1); // +1 for you
    setFriends(friends.map((friend) => ({ ...friend, share })));
  };

  // Calculate total shares
  const totalShares = friends.reduce((sum, friend) => sum + Number(friend.share || 0), 0);

  // Your share
  const yourShare = transaction.amount - totalShares;

  // Copy sharing details to clipboard
  const copyToClipboard = () => {
    const text = `Expense: ${transaction.description}\nTotal: ${formatCurrency(transaction.amount)}\nYour share: ${formatCurrency(yourShare)}\n\nFriend shares:\n${friends.map((f) => `${f.name}: ${formatCurrency(f.share)}`).join("\n")}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Send expense details to friends (mock)
  const sendToFriends = () => {
    // In a real app, this would send emails or notifications
    setSent(true);
    setTimeout(() => setSent(false), 2000);
  };

  // Generate UPI payment link
  const generateUpiLink = (amount, friendName) => {
    // Format: upi://pay?pa=UPI_ID&pn=PAYEE_NAME&am=AMOUNT&cu=CURRENCY&tn=TRANSACTION_NOTE
    const payeeName = encodeURIComponent("ExpenseTracker");
    const note = encodeURIComponent(`Payment for ${transaction.description} from ${friendName}`);

    // For INR currency only
    const upiCurrency = "INR";

    return `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=${upiCurrency}&tn=${note}`;
  };

  // Show QR code for a specific friend
  const showQRCode = (friend) => {
    setSelectedFriend(friend);
    setShowQR(true);
  };

  // Share payment request via WhatsApp
  const shareViaWhatsApp = (friend) => {
    const message = encodeURIComponent(
      `Hi ${friend.name}, please pay ${formatCurrency(friend.share)} for "${transaction.description}". ` +
        `You can pay me via UPI: ${upiId}`,
    );

    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  // Download QR code as image
  const downloadQR = () => {
    if (!qrRef.current) return;

    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;

    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `payment-qr-${selectedFriend.name.replace(/\s+/g, "-").toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold">Split Expense</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {showQR ? (
          <div className="p-4">
            <button
              onClick={() => setShowQR(false)}
              className="mb-4 text-sm text-blue-500 hover:text-blue-700 flex items-center"
            >
              ← Back to sharing
            </button>

            <div className="text-center mb-4">
              <h4 className="font-medium">Payment QR for {selectedFriend.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Amount: {formatCurrency(selectedFriend.share)}</p>
            </div>

            <div className="flex justify-center mb-4" ref={qrRef}>
              <QRCodeSVG
                value={generateUpiLink(selectedFriend.share, selectedFriend.name)}
                size={200}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"}
                includeMargin={true}
              />
            </div>

            <div className="flex justify-center space-x-3">
              <button
                onClick={downloadQR}
                className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <Download className="h-4 w-4 mr-1" />
                <span>Download QR</span>
              </button>

              <button
                onClick={() => shareViaWhatsApp(selectedFriend)}
                className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                <Share className="h-4 w-4 mr-1" />
                <span>Share on WhatsApp</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Expense</p>
              <p className="font-medium">{transaction.description}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
              <p className="text-xl font-bold text-red-500">{formatCurrency(transaction.amount)}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Your UPI ID (for payments)</label>
              <input
                type="text"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700"
              />
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium">Split with friends</p>
                <button onClick={splitEqually} className="text-sm text-blue-500 hover:text-blue-700">
                  Split equally
                </button>
              </div>

              <div className="space-y-3 mb-3">
                {friends.map((friend) => (
                  <div key={friend.id} className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Name"
                          value={friend.name}
                          onChange={(e) => handleFriendChange(friend.id, "name", e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="email"
                          placeholder="Email"
                          value={friend.email}
                          onChange={(e) => handleFriendChange(friend.id, "email", e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700"
                        />
                      </div>
                      <div className="w-20">
                        <input
                          type="number"
                          placeholder="Share"
                          value={friend.share}
                          onChange={(e) => handleFriendChange(friend.id, "share", e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700"
                        />
                      </div>
                      <button onClick={() => removeFriend(friend.id)} className="text-red-500 hover:text-red-700">
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {upiId && friend.name && friend.share > 0 && (
                      <div className="flex space-x-2 ml-auto">
                        <button
                          onClick={() => showQRCode(friend)}
                          className="text-xs px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
                        >
                          Generate QR
                        </button>
                        <button
                          onClick={() => shareViaWhatsApp(friend)}
                          className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          WhatsApp
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button onClick={addFriend} className="text-sm text-blue-500 hover:text-blue-700">
                + Add another friend
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-100 dark:bg-slate-700 rounded-md">
              <div className="flex justify-between items-center">
                <p className="font-medium">Your share</p>
                <p className="font-bold">{formatCurrency(yourShare)}</p>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <p>Total</p>
                <p>{formatCurrency(transaction.amount)}</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex-1"
              >
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
              <button
                onClick={sendToFriends}
                className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex-1"
                disabled={friends.some((f) => !f.name || !f.email)}
              >
                {sent ? <Check className="h-4 w-4 mr-1" /> : <Send className="h-4 w-4 mr-1" />}
                <span>{sent ? "Sent!" : "Send"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

