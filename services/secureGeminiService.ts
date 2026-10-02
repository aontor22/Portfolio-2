type LegacyChatHistory = {
  role: string;
  parts: { text: string }[];
};

type TriviaCheckResult = {
  correct: boolean;
  feedback: string;
};

async function postAI<T>(
  payload: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      (data as { error?: string })?.error || 'AI request failed',
    );
  }

  return data as T;
}

function normalizeHistory(history: LegacyChatHistory[] = []) {
  return history
    .slice(-8)
    .map((item) => ({
      role:
        item.role === 'model' || item.role === 'assistant'
          ? 'assistant'
          : 'user',
      text: Array.isArray(item.parts)
        ? item.parts
            .map((part) => part?.text || '')
            .join(' ')
            .trim()
        : '',
    }))
    .filter((item) => item.text);
}

export const generateTriviaQuestion = async (
  topic: string,
): Promise<string> => {
  try {
    const data = await postAI<{ text: string }>({
      action: 'trivia-question',
      prompt: topic,
    });

    return data.text || 'Could not generate question.';
  } catch (error) {
    console.error('Trivia generation error:', error);
    return 'Who is known as the father of computing?';
  }
};

export const checkTriviaAnswer = async (
  question: string,
  userAnswer: string,
): Promise<TriviaCheckResult> => {
  try {
    const data = await postAI<{
      data: TriviaCheckResult;
    }>({
      action: 'check-trivia',
      question,
      answer: userAnswer,
    });

    return data.data;
  } catch (error) {
    console.error('Answer check error:', error);

    return {
      correct: false,
      feedback: 'AI is sleeping. Try again!',
    };
  }
};

export const getChatResponse = async (
  history: LegacyChatHistory[],
  newMessage: string,
): Promise<string> => {
  try {
    const data = await postAI<{ text: string }>({
      action: 'chat',
      prompt: newMessage,
      history: normalizeHistory(history),
    });

    return data.text || 'Connection to the neural net disrupted.';
  } catch (error) {
    console.error('Chat error:', error);
    return 'Connection to the neural net disrupted.';
  }
};

export const generateFuturisticImage = async (
  prompt: string,
): Promise<string | null> => {
  try {
    const data = await postAI<{ image: string }>({
      action: 'image',
      prompt,
    });

    return data.image || null;
  } catch (error) {
    console.error('Image generation error:', error);
    return null;
  }
};
