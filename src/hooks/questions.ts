import { generateJWT } from "@/lib/jwt/action";
import { useStreakAnnouncerModalStore } from "@/store/modals";
import { useAnswerCorrectStore, useAnswerStore, useQuestionStore, useTopicStore } from "@/store/questions";
import { useScoreStore, useAnswerCounterStore } from "@/store/score";
import { Answers } from "@/types/answer";
import { Topic } from "@/types/topic";
import axios from "axios";
import { useAnswerAttemptsStore } from "@/store/questions"

// Custom hook to encapsulate logic because it is used in both math and reading/writing components
const useQuestionHandler = () => {
  const setRandomQuestion = useQuestionStore((state) => state.setRandomQuestion);
  const answer = useAnswerStore((state) => state.answer);
  const increaseScore = useScoreStore((state) => state.increaseScore);
  const increaseCorrectCounter = useAnswerCounterStore((state) => state.increaseCount);
  const resetCorrectCounter = useAnswerCounterStore((state) => state.resetCount);
  const selectedTopic = useTopicStore((state) => state.selectedTopic);
  const setIsAnswerCorrect = useAnswerCorrectStore((state) => state.setIsAnswerCorrect);
  const correctCount = useAnswerCounterStore((state) => state.count);
  const openAnnouncerModal = useStreakAnnouncerModalStore((state) => state.openModal);

  const attempts = useAnswerAttemptsStore((state) => state.attempts)
  const setAttempts = useAnswerAttemptsStore((state) => state.setAttempts)

  const fetchRandomQuestion = async (type: "Math" | "Reading", topic: Topic): Promise<void> => {
    try {
      let link = ""

      if (type == "Math") {
        link = "/api/questions/math"
      } else {
        link = "/api/questions/reading"
      }
      const response = await axios.get(`${link}?topic=${topic.name}`);
      const questionData = response.data?.doc_array?.[0] ?? null;
      setRandomQuestion(questionData);
      setIsAnswerCorrect("none")
    } catch (error) {
      console.error("Error fetching question:", error);
      setRandomQuestion(null);
    }
  };

  const handleAnswerSubmit = async(
    type: "Math" | "Reading",
    correctAnswer: number, // Correct answer index
    answerCorrectRef: Record<Answers, number> = { A: 0, B: 1, C: 2, D: 3 } // Mapping for answer keys
  ) : Promise<void> => {
    const isCorrect = answerCorrectRef[answer ?? "A"] === correctAnswer;

    if (isCorrect) {
      increaseCorrectCounter();
      increaseScore();
    } else {
      resetCorrectCounter();
    }

    setIsAnswerCorrect(isCorrect);

    // making a new token from a server-side action (function that runs on the SEVER!!)
    const token = await generateJWT({
      state: isCorrect == true ? 1 : 0
    })

    // Send request to backend
    await axios.post("/api/questions/handle-submit", {
          jwtToken: token
    });
    
    if (isCorrect && selectedTopic) {
      setTimeout(() => {
        fetchRandomQuestion(type, selectedTopic)
      }, 1500);
    }
  };

  const handleCheckThreeStreak = () => {
    if (correctCount === 3) {
      openAnnouncerModal();
    }
  }

  return {
    fetchRandomQuestion,
    handleAnswerSubmit,
    handleCheckThreeStreak
  };
};

export default useQuestionHandler
