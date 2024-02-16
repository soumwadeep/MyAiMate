import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const ChatWindow = () => {
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
  const [query, setQuery] = useState("");
  const [savedQuery, setSavedQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [gettingResponse, setGettingResponse] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [newLocalHistory, setNewLocalHistory] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [fetchRequest, setFetchRequest] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    if (fetchRequest) {
      const storedHistory = localStorage.getItem("ConversationHistory");
      if (storedHistory) {
        setConversationHistory(JSON.parse(storedHistory));
        setNewLocalHistory(JSON.parse(storedHistory));
      }
      setFetchRequest(false);
    }
  }, [fetchRequest]);

  const updateLocalStorage = (updatedHistory) => {
    localStorage.setItem("ConversationHistory", JSON.stringify(updatedHistory));
  };

  const handleFetch = () => {
    setFetchRequest(true);
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setGettingResponse(true);
    setErrorMsg("");
    try {
      setSavedQuery(query);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContentStream(query);
      const response = await result.response;
      const text = response.text();
      setAnswer(text);
      const newConversation = { query, response: text };
      const updatedHistory = [...conversationHistory, newConversation];
      const updatedLocalStorageHistory = [...newLocalHistory, newConversation];
      setConversationHistory(updatedHistory);
      updateLocalStorage(updatedLocalStorageHistory);
      setNewLocalHistory(updatedLocalStorageHistory);
    } catch (err) {
      console.error("Error Fetching Data:", err);
      setErrorMsg("We Were Unable To Give You The Answer For This Query.");
    } finally {
      setGettingResponse(false);
      setQuery("");
    }
  };

  const handleRegenerate = async (e) => {
    e.preventDefault();
    setIsRegenerating(true);
    setGettingResponse(true);
    setErrorMsg("");
    try {
      setSavedQuery(query);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContentStream(query);
      const response = await result.response;
      const text = response.text();
      setAnswer(text);
      const newConversation = { query: savedQuery, response: text };
      const updatedHistory = [...conversationHistory, newConversation];
      const updatedLocalStorageHistory = [...newLocalHistory, newConversation];
      setConversationHistory(updatedHistory);
      updateLocalStorage(updatedLocalStorageHistory);
      setNewLocalHistory(updatedLocalStorageHistory);
    } catch (err) {
      console.error("Error Fetching Data:", err);
      setErrorMsg("We Were Unable To Give You The Answer For This Query.");
    } finally {
      setIsRegenerating(false);
      setGettingResponse(false);
    }
  };

  const handleCopy = async (query, response) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = `Query: ${query.toString()}\nResponse: ${response.toString()}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      Swal.fire(
        "Copied Successfully!",
        "Paste It On A Text File And Store It!",
        "success"
      );
    } catch (err) {
      console.error("Error copying to clipboard:", err);
      Swal.fire("Failed To Copy!", "Please Try Again..", "error");
    }
  };

  const handleDownload = async (query, response) => {
    // console.log("Under Dev");
  };

  const formatResponse = (response) => {
    return response.split("\n").map((line, index) => (
      <p className="ms-5" key={index}>
        {line}
      </p>
    ));
  };

  return (
    <main className="chat-window">
      <button className="btn btn-warning fw-bold" onClick={handleFetch}>
        Load Previous Chats
      </button>
      <button className="btn btn-danger ms-3 fw-bold" onClick={handleReload}>
        Reset/Reload
      </button>
      <div className="addminheight">
        {conversationHistory.map((conversation, index) => (
          <div key={index} className="response-container">
            <p className="lh-lg text-danger fw-bold">
              <img src="/user.png" className="logo" alt="user" />
              <p className="ms-5">{conversation.query}</p>
            </p>
            {conversation.response && (
              <div className="response">
                <img src="/logo.png" className="logo" alt="ai" />
                {formatResponse(conversation.response)}
              </div>
            )}
            {/* {errorMsg && <p className="text-danger">{errorMsg}</p>} */}
            <i
              className="fa-solid d-none fs-5 me-3 mb-5 socialicons"
              onClick={handleRegenerate}
            ></i>
            <i
              className="fa-solid fa-copy fs-5 me-3 mb-5 socialicons"
              onClick={() =>
                handleCopy(conversation.query, conversation.response)
              }
            ></i>
            <i
              className="fa-solid fa-download fs-5 me-3 mb-5 socialicons"
              onClick={handleDownload}
            ></i>
            <i className="fa-regular fa-thumbs-up fs-5 me-3 mb-5 socialicons"></i>
            <i className="fa-regular fa-thumbs-down fs-5 me-3 mb-5 socialicons"></i>
          </div>
        ))}
        {!conversationHistory.length && !gettingResponse && !errorMsg && (
          <h1 className="makeitcenter fw-bold">Welcome To My AI Mate</h1>
        )}
        {errorMsg ? (
          <>
            <p className="lh-lg text-danger fw-bold mb-2">
              <img src="/user.png" className="logo" alt="user" />
              <p className="ms-5">{savedQuery}</p>
            </p>
            <img src="/logo.png" className="logo rounded" alt="ai" />
            &nbsp; <p className="text-danger ms-5">{errorMsg}</p>
            <i
              className="fa-solid d-none fs-5 me-3 mb-5 socialicons"
              onClick={handleRegenerate}
            ></i>
            <i
              className="fa-solid fa-copy fs-5 me-3 mb-5 socialicons"
              onClick={() => handleCopy(savedQuery, errorMsg)}
            ></i>
            <i
              className="fa-solid fa-download fs-5 me-3 mb-5 socialicons"
              onClick={handleDownload}
            ></i>
            <i className="fa-regular fa-thumbs-up fs-5 me-3 mb-5 socialicons"></i>
            <i className="fa-regular fa-thumbs-down fs-5 me-3 mb-5 socialicons"></i>
          </>
        ) : (
          ""
        )}
        {gettingResponse && !isRegenerating ? (
          <>
            <p className="lh-lg text-danger fw-bold mb-2">
              <img src="/user.png" className="logo" alt="user" />
              <p className="ms-5">{query}</p>
            </p>
            <img src="/logo.png" className="logo rounded" alt="ai" />
            &nbsp;
            {errorMsg ? (
              <p className="text-danger">{errorMsg}</p>
            ) : (
              "Thinking..."
            )}
          </>
        ) : gettingResponse && isRegenerating ? (
          <>
            <p className="lh-lg text-danger fw-bold mb-2">
              <img src="/user.png" className="logo" alt="user" />
              <p className="ms-5">{savedQuery}</p>
            </p>
            <img src="/logo.png" className="logo rounded" alt="ai" />
            &nbsp;{" "}
            {errorMsg ? (
              <p className="text-danger">{errorMsg}</p>
            ) : (
              "Thinking..."
            )}
          </>
        ) : null}
      </div>
      <center>
        <form
          className="row row-cols-lg align-items-center container"
          onSubmit={handleSearch}
        >
          <div className="col-10">
            <div className="input-group input-group-lg">
              <input
                type="text"
                className={
                  gettingResponse
                    ? "form-control text-gray sticky-bottom"
                    : "form-control sticky-bottom"
                }
                id="inlineFormInputGroupUsername"
                placeholder={
                  gettingResponse
                    ? "Thinking..."
                    : "Write Something To Start..."
                }
                value={query}
                disabled={gettingResponse}
                required
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-1">
            <button
              type="submit"
              className={
                gettingResponse
                  ? "btn btn-secondary btn-lg"
                  : "btn btn-primary btn-lg"
              }
              disabled={gettingResponse}
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </center>
    </main>
  );
};

export default ChatWindow;
