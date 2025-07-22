export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#3a6e61] via-[#5ca78c] to-[#2f5e50] text-white px-6 text-center">
      <h1 className="text-4xl font-serif font-bold mb-4 drop-shadow-md">🎉 Payment Successful!</h1>
      <p className="text-lg text-[#d4f0e1] mb-6">
        Thank you for shopping with <span className="font-semibold">DWARKA</span> 🌿
      </p>
      <a
        href="/"
        className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all"
      >
        Return to Home
      </a>
    </div>
  );
}
