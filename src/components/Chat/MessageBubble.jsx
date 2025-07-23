const MessageBubble = ({ message, isSender }) => {
  const originalText = message.originalText || message.text || '';
  // Misal kamu ingin tampilkan semua bahasa, pakai:
  // const translations = message.translations || {};

  // Atau jika ingin render satu bahasa (misal Mandarin/zh), bisa manual:
  // const translatedText = message.translations?.zh;

  // Bisa juga looping semua translations jika mau tampilkan semua terjemahan

  // Format timestamp
  let formattedTime = '';
  try {
    let date;
    if (message.timestamp?.seconds) date = new Date(message.timestamp.seconds * 1000);
    else if (typeof message.timestamp === 'string' || typeof message.timestamp === 'number') date = new Date(message.timestamp);
    else if (message.timestamp?._seconds) date = new Date(message.timestamp._seconds * 1000);
    if (date && !isNaN(date.getTime())) {
      formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  } catch (err) {}

  return (
    <div className={isSender ? "flex justify-end" : "flex justify-start"}>
      <div className={`max-w-md px-4 py-2 ${isSender ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-200"} rounded-lg`}>
        {/* Pengirim: hanya originalText */}
        {isSender && (
          <>
            <div className="text-sm">{originalText}</div>
            <div className="text-xs text-indigo-200 mt-1 text-right">{formattedTime}</div>
          </>
        )}
        {/* Penerima: translations (jika ada), lalu originalText */}
        {!isSender && (
          <>
            {/* Loop setiap bahasa yang ADA di Firestore */}
            {message.translations &&
              Object.entries(message.translations).map(([lang, trans], i) => (
                <div key={lang} className="font-semibold text-white mb-1">{trans}</div>
              ))
            }
            <hr className="border-gray-500 my-2" />
            <div className="text-sm text-gray-300">{originalText}</div>
            <div className="text-xs text-gray-400 text-right mt-1">{formattedTime}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
