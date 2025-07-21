const MessageBubble = ({ message, isSender }) => {
  const bubbleClasses = isSender
    ? "bg-indigo-600 text-white rounded-lg rounded-br-none"
    : "bg-gray-700 text-gray-200 rounded-lg rounded-bl-none";
  const containerClasses = isSender ? "flex justify-end" : "flex justify-start";

  // ✅ Format timestamp aman dari berbagai jenis format
  let formattedTime = '';
  try {
    let date;

    if (message.timestamp?.seconds) {
      date = new Date(message.timestamp.seconds * 1000);
    } else if (typeof message.timestamp === 'string' || typeof message.timestamp === 'number') {
      date = new Date(message.timestamp);
    } else if (message.timestamp?._seconds) {
      date = new Date(message.timestamp._seconds * 1000);
    }

    if (date && !isNaN(date.getTime())) {
      formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  } catch (err) {
    formattedTime = '';
  }

  return (
    <div className={containerClasses}>
      <div className={`max-w-md px-4 py-2 ${bubbleClasses}`}>
        {isSender ? (
          <div>
            <p className="text-sm">{message.text}</p>
            <p className="text-xs text-indigo-200 mt-1 text-right">{formattedTime}</p>
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold text-white">{message.text}</p>
            <hr className="my-1 border-gray-400/40" />
            <div className="flex justify-between items-end">
              <p className="text-sm text-gray-300">{message.originalText}</p>
              <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">{formattedTime}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;