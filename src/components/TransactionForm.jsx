"use client";

import { useState, useContext, useEffect, useRef } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { Card } from "./ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";
import { Mic, Camera, X } from "lucide-react";
import Tesseract from "tesseract.js";

export default function TransactionForm() {
  const { addTransaction, categories, detectCategory, currency } = useContext(TransactionContext);

  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState(null);
  const [scanResult, setScanResult] = useState(null);

  const fileInputRef = useRef(null);

  // Check for SpeechRecognition API support
  const SpeechRecognition = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

  // Reset form after submission
  const resetForm = () => {
    setFormData({
      type: "expense",
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().slice(0, 10),
    });
    setTranscript("");
    setScanResult(null);
    setScannedImage(null);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "description" && formData.type === "expense" && !formData.category) {
      // Auto-detect category based on description
      const detectedCategory = detectCategory(value);
      setFormData({ ...formData, [name]: value, category: detectedCategory });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.category) {
      alert("Please fill in all required fields");
      return;
    }

    addTransaction(formData);
    resetForm();
  };

  // Voice recognition effect
  useEffect(() => {
    let recognition = null;

    if (isListening && SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");

        setTranscript(transcript);
        parseVoiceInput(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "no-speech") {
          alert("No speech detected. Please try again.");
        } else if (event.error === "not-allowed") {
          alert("Microphone permission denied. Please allow microphone access in your browser settings.");
        } else if (event.error === "network") {
          alert("Network error. Please check your internet connection.");
        }
      };

      recognition.onend = () => {
        if (isListening) {
          console.log("Recognition ended, restarting...");
          recognition.start(); // Restart if stopped unexpectedly
        }
      };

      try {
        recognition.start();
      } catch (error) {
        console.error("Error starting recognition:", error);
        setIsListening(false);
      }
    } else if (isListening && !SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or another compatible browser.");
      setIsListening(false);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening]);

  // Parse voice input to extract transaction details
  const parseVoiceInput = (text) => {
    const amountMatch = text.match(/(\d+)/);
    const amount = amountMatch ? amountMatch[0] : "";

    let category = "";
    let type = "expense";

    for (const cat of categories.expense) {
      if (text.toLowerCase().includes(cat.toLowerCase())) {
        category = cat;
        break;
      }
    }

    for (const cat of categories.income) {
      if (text.toLowerCase().includes(cat.toLowerCase())) {
        category = cat;
        type = "income";
        break;
      }
    }

    setFormData({
      ...formData,
      amount,
      category,
      type,
      description: text,
    });
  };

  // Toggle voice recognition
  const toggleListening = () => {
    setIsListening((prev) => !prev);
    if (isListening) {
      setTranscript("");
    }
  };

  // Handle file upload for OCR
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setScannedImage(event.target.result);
      processImageOCR(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Process image with OCR
  const processImageOCR = async (imageData) => {
    setIsScanning(true);

    try {
      const result = await Tesseract.recognize(imageData, "eng");
      const text = result.data.text;
      setScanResult(text);
      extractReceiptInfo(text);
    } catch (error) {
      console.error("OCR Error:", error);
      alert("Failed to scan the receipt. Please try again or enter details manually.");
    } finally {
      setIsScanning(false);
    }
  };

  // Extract information from receipt text
  const extractReceiptInfo = (text) => {
    const lines = text.split("\n");
    const amountRegex = /(?:total|amount|sum)(?:\s*:)?\s*(?:Rs\.?|₹|INR|USD|\$|EUR|€)?\s*(\d+(?:\.\d+)?)/i;
    const amountMatch = text.match(amountRegex);

    const dateRegex = /(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})/i;
    const dateMatch = text.match(dateRegex);

    let merchantName = "";
    if (lines.length > 0) {
      merchantName = lines[0].trim();
    }

    setFormData({
      ...formData,
      amount: amountMatch ? amountMatch[1] : "",
      date: dateMatch ? formatDate(dateMatch[1]) : new Date().toISOString().slice(0, 10),
      description: merchantName || "Receipt scan",
      category: detectCategory(merchantName),
    });
  };

  // Format date from various formats to YYYY-MM-DD
  const formatDate = (dateStr) => {
    const parts = dateStr.split(/[-/.]/);
    if (parts.length !== 3) return new Date().toISOString().slice(0, 10);

    let day, month, year;
    if (parts[2].length === 4) {
      // DD-MM-YYYY
      day = parts[0];
      month = parts[1];
      year = parts[2];
    } else {
      // Assume MM-DD-YY
      month = parts[0];
      day = parts[1];
      year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
    }

    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  // Clear scanned image and results
  const clearScan = () => {
    setScannedImage(null);
    setScanResult(null);
  };

  return (
    <Card className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Add Transaction</h2>

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="manual">Manual</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="scan">Scan</TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex space-x-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="expense"
                    checked={formData.type === "expense"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Expense</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="income"
                    checked={formData.type === "income"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Income</span>
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Amount ({currency})</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  className="input"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="select" required>
                  <option value="">Select category</option>
                  {formData.type === "expense"
                    ? categories.expense.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))
                    : categories.income.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  className="input"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="input" />
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Add Transaction
              </button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="voice">
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-4 rounded-full ${isListening ? "bg-red-500" : "bg-blue-500"} text-white`}
                disabled={!SpeechRecognition}
              >
                <Mic className="h-6 w-6" />
              </button>
            </div>

            {!SpeechRecognition && (
              <p className="text-center text-red-500 text-sm">
                Voice input is not supported in this browser. Please use Chrome or another compatible browser.
              </p>
            )}

            {isListening && (
              <div className="text-center text-sm">
                <p>Listening... Speak clearly about your transaction.</p>
                <p className="text-xs text-gray-500 mt-1">
                  Try saying: "Spent 500 on Food at Restaurant" or "Received 1000 as Salary"
                </p>
              </div>
            )}

            {transcript && (
              <div className="p-3 bg-gray-100 dark:bg-slate-700 rounded-md">
                <p className="text-sm font-medium">Transcript:</p>
                <p>{transcript}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="expense"
                      checked={formData.type === "expense"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span>Expense</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="income"
                      checked={formData.type === "income"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span>Income</span>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Amount ({currency})</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  className="input"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="select" required>
                  <option value="">Select category</option>
                  {formData.type === "expense"
                    ? categories.expense.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))
                    : categories.income.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  className="input"
                />
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Add Transaction
              </button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="scan">
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <button
                type="button"
                onClick={triggerFileUpload}
                className="p-4 rounded-full bg-blue-500 text-white"
                disabled={isScanning}
              >
                <Camera className="h-6 w-6" />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            </div>

            {isScanning && (
              <div className="text-center">
                <p>Scanning receipt...</p>
              </div>
            )}

            {scannedImage && (
              <div className="relative">
                <img
                  src={scannedImage || "/placeholder.svg"}
                  alt="Scanned receipt"
                  className="w-full h-40 object-contain bg-gray-100 dark:bg-slate-700 rounded-md"
                />
                <button onClick={clearScan} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {scanResult && (
              <div className="p-3 bg-gray-100 dark:bg-slate-700 rounded-md text-xs max-h-40 overflow-y-auto">
                <p className="font-medium mb-1">Extracted text:</p>
                <p className="whitespace-pre-line">{scanResult}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Amount ({currency})</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  className="input"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="select" required>
                  <option value="">Select category</option>
                  {formData.type === "expense"
                    ? categories.expense.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))
                    : categories.income.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  className="input"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="input" />
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Add Transaction
              </button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}