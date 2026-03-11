'use client';

import React, { useState, useEffect } from 'react';

import { questions } from '@/models/question.model';

// Function to shuffle an array
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function Page() {
  const [shuffledQuestions, setShuffledQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setShuffledQuestions(shuffle(questions));
  }, []);

  const getNextPair = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 2 >= shuffledQuestions.length ? 0 : prevIndex + 2));
  };

  const currentPair = shuffledQuestions.slice(currentIndex, currentIndex + 2);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: '#000'
      }}
    >
      <div
        style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          width: '150vw',
          height: '100vh'
        }}
      >
        <img src="/back.png" style={{ height: '100%', objectFit: 'cover' }} />
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: '0',
          left: '-50%',
          width: '150vw',
          height: '100vh'
        }}
      >
        <img src="/general.png" alt="Character" style={{ height: '110%', objectFit: 'cover' }} />
      </div>

      <div className="fixed h-full w-full p-5 flex flex-col justify-between" style={{}}>
        <div className="flex justify-end">
          <button onClick={getNextPair} style={{ zIndex: '5' }}>
            <img src="/button.png" style={{ width: '220px', height: 'auto' }} />
          </button>
        </div>

        <div className="flex flex-col gap-2 justify-center">
          {currentPair.map((question, index) => (
            <div
              key={index}
              className="relative flex flex-col justify-center items-center p-10"
              style={{ height: '22vh' }}
            >
              <img
                className="absolute"
                src={index === 0 ? '/red.png' : 'green.png'}
                style={{ width: '100%', height: '100%' }}
              />

              <span
                className="text-xl font-black text-center uppercase leading-tight text-white pointer-events-none tracking-widest"
                style={{ textShadow: '2px 2px 0px rgba(0, 0, 0, 0.3)', zIndex: '10' }}
              >
                {question}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/*



*/
