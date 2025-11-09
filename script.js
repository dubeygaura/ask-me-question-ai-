const API_KEY = "AIzaSyB587aVfpaHbYTxJwsNyf49jtojofT-uC4";

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "hi-IN";

let output = document.getElementById("out");

function handleClick() {
  output.innerText = "🎧 Listening...";
  recognition.start();
}

recognition.onresult = async (event) => {
  const text = event.results[0][0].transcript;
  output.innerText = `You said: "${text}"`;
  console.log("User:", text);

  // send text to Gemini API
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }]
      }),
    }
  );

  const data = await res.json();
  console.log("Response:", data);

  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "माफ कीजिए, मैं समझ नहीं पाया।";

  output.innerText = `🤖 AI: ${reply}`;
  speakReply(reply);
};

// ✅ Convert text to voice
function speakReply(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "hi-IN";
  utter.rate = 1.0;
  utter.pitch = 1;

  const voices = speechSynthesis.getVoices();
  const hindiVoice = voices.find(v => v.lang === "hi-IN" || v.name.includes("Google हिन्दी"));
  if (hindiVoice) utter.voice = hindiVoice;

  setTimeout(() => speechSynthesis.speak(utter), 300);
}
