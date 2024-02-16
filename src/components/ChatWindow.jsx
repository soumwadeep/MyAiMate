import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";

const ChatWindow = () => {
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
  const [prompt, setPrompt] = useState("");
  const [savedPrompt, setSavedPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      setSavedPrompt(prompt);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContentStream(prompt);
      const response = await result.response;
      const text = await response.text();
      setAnswer(text);
    } catch (err) {
      console.log(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main>
      <div className="chat-container">
        {prompt && !isGenerating && !answer && (
          <>
            <img src="/user.png" alt="user" className="logo" />
            <p className="ms-5">{prompt}</p>
          </>
        )}
        {!prompt && !isGenerating && !answer && (
          <>
            <img src="/logo.png" alt="logo" className="logo" />
            <p className="ms-5">Hi. Ask me anything you want.</p>
          </>
        )}
        {isGenerating && !answer && (
          <>
            <img src="/user.png" alt="user" className="logo" />
            <p className="ms-5 mb-3">{savedPrompt}</p>
            <img src="/logo.png" alt="logo" className="logo" />
            <p className="ms-5">Thinking...</p>
          </>
        )}
        {!isGenerating && answer && (
          <>
            <img src="/user.png" alt="user" className="logo" />
            <p className="ms-5 mb-3">{savedPrompt}</p>
            <img src="/logo.png" alt="logo" className="logo" />
            <p className="ms-5">{answer}</p>
          </>
        )}
      </div>
      <form
        className="row row-cols-lg align-items-center container"
        onSubmit={handleGenerate}
      >
        <div className="col-10">
          <div className="input-group input-group-lg">
            <input
              type="text"
              className={`form-control sticky-bottom ${
                isGenerating ? "text-gray" : ""
              }`}
              id="inlineFormInputGroupUsername"
              placeholder={
                isGenerating ? "Thinking..." : "Write something to start..."
              }
              value={prompt}
              disabled={isGenerating}
              required
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
        </div>
        <div className="col-1">
          <button
            type="submit"
            className={`btn btn-lg ${
              isGenerating ? "btn-secondary" : "btn-info"
            }`}
            disabled={isGenerating}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </form>
    </main>
  );
};

export default ChatWindow;
