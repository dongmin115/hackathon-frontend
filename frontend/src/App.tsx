import { useState } from "react";
import "./App.css";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Header = () => {
  return (
    <div className="w-screen absolute h-1/3 top-0">
      <img
        src="https://i.ibb.co/xD21ngc/DALL-E-2024-06-01-03-43-15-A-simple-minimalist-black-themed-icon-for-a-webpage-featuring-the-text-le.webp"
        alt="logo"
        className="w-screen h-full "
      />
    </div>
  );
};

function App() {
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");
  const [bubbles, setBubbles] = useState<
    { type: "user" | "reply" | "question"; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const [questions, setQuestions] = useState<
    { question: string; answer: "O" | "X" }[]
  >([]);
  const [answer, setAnswer] = useState<"O" | "X" | "">("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleAddBubble = async () => {
    if (text.trim()) {
      setBubbles([...bubbles, { type: "user", text }]);
      setText("");

      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/chat/summary",
          {
            prompt: text
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        console.log("Response:", response.data);
        setBubbles((prev) => [
          ...prev,
          { type: "reply", text: response.data.summary }
        ]);

        setQuestions(response.data.oxQuizzes);
        setCurrentQuestionIndex(0);
        setAnswer("");
      } catch (error) {
        console.error("Error fetching reply:", error);

        setBubbles((prev) => [
          ...prev,
          { type: "reply", text: "답변을 가져오는 데 실패했습니다." }
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAnswerSubmit = async (selectedAnswer: "O" | "X") => {
    setAnswer(selectedAnswer);
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.answer === selectedAnswer;

    alert(
      `${isCorrect ? "correct" : "incorrect"}. 정답 : ${currentQuestion.answer}.`
    );

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer("");
    } else {
      alert("모든 문제를 푸셨습니다!");
    }
  };

  useEffect(() => {
    AOS.init();
  });

  return (
    <div className="w-screen h-screen flex justify-evenly flex-col items-center">
      {show ? (
        <div className="w-full h-full flex flex-col items-center px-[15%] py-[2%] overflow-y-scroll">
          <p className=" font-bold text-3xl mb-8">Level up! 😆</p>
          <div className="chat chat-start self-start w-[50%] space-y-8 mb-8">
            <div
              data-aos="zoom-in-up"
              className="chat-bubble bg-neutral text-white"
            >
              제가 이해를 도울게요!
            </div>
          </div>
          <div className="w-full flex flex-col items-center space-y-8">
            {bubbles.map((bubble, index) => (
              <div
                key={index}
                className={`chat-bubble ${bubble.type === "user" ? "chat-end self-end bg-gray-300 text-black" : "chat-start self-start bg-neutral text-white"} `}
                data-aos="zoom-in-up"
              >
                {bubble.text}
              </div>
            ))}
          </div>
          {questions.length > 0 && currentQuestionIndex < questions.length && (
            <div className="w-full flex flex-col items-center mt-80">
              <p className="text-xl mb-2">
                {questions[currentQuestionIndex].question}
              </p>
              <div className="flex space-x-4">
                <button
                  className={`btn ${
                    answer === "O" ? "btn-success" : "btn-outline"
                  } w-20`}
                  onClick={() => handleAnswerSubmit("O")}
                  disabled={loading || answer !== ""}
                >
                  O
                </button>
                <button
                  className={`btn ${
                    answer === "X" ? "btn-error" : "btn-outline"
                  } w-20`}
                  onClick={() => handleAnswerSubmit("X")}
                  disabled={loading || answer !== ""}
                >
                  X
                </button>
              </div>
            </div>
          )}
          {loading && (
            <div
              className="chat-bubble bg-neutral text-white self-start"
              data-aos="zoom-in-up"
            >
              답변을 가져오는 중...
            </div>
          )}
          <div className="w-full flex mt-auto h-40">
            <textarea
              className="textarea textarea-neutral w-full h-full text-xl mt-auto border-2 border-neutral rounded-md p-2 resize-none"
              placeholder="이해되지 않는 지문을 넣어보세요"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className="btn btn-neutral ml-2 h-full w-[10%] text-2xl"
              onClick={handleAddBubble}
              disabled={loading}
            >
              send
            </button>
          </div>
        </div>
      ) : (
        <>
          <Header />
          <div className="flex flex-col items-center space-y-12 mt-80">
            <p
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="500"
              className="text-3xl"
            >
              어려운 지문때문에 고민이신가요?
            </p>
            <p
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="700"
              className="text-3xl"
            >
              제가 도와드릴게요!
            </p>
          </div>
          <img
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="1000"
            src="https://i.ibb.co/rMMYCpR/levelup-logo-1.png"
            alt="reading"
            className=" size-48 rounded-lg"
          />
          <button
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="1500"
            className="btn w-48  btn-neutral text-lg "
            onClick={() => setShow(true)}
          >
            시작하기
          </button>
        </>
      )}
    </div>
  );
}

export default App;
