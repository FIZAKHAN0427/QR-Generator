const form = document.getElementById("qrForm");
const urlInput = document.getElementById("urlInput");
const resultDiv = document.getElementById("result");
const qrImage = document.getElementById("qrImage");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const downloadBtn = document.getElementById("downloadBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const url = urlInput.value.trim();
  
  if (!url) {
    showError("Please enter a valid URL");
    return;
  }

  // Show loading state
  loadingDiv.classList.remove("hidden");
  resultDiv.classList.add("hidden");
  errorDiv.classList.add("hidden");

  try {
    const response = await fetch("/api/generate-qr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to generate QR code");
    }

    // Display QR code
    qrImage.src = data.qrCode;
    qrImage.dataset.url = url;
    resultDiv.classList.remove("hidden");
    errorDiv.classList.add("hidden");
    
  } catch (error) {
    showError(error.message);
  } finally {
    loadingDiv.classList.add("hidden");
  }
});

downloadBtn.addEventListener("click", () => {
  const url = qrImage.dataset.url;
  const link = document.createElement("a");
  link.href = qrImage.src;
  link.download = `qr-code-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

function showError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
  resultDiv.classList.add("hidden");
  loadingDiv.classList.add("hidden");
}
