import { useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { PlayerState } from '../types/state';
import { computeQiFillRate } from '../utils/fillRate';

const TICK_MS = 1000;

export function useGameTick(setState: Dispatch<SetStateAction<PlayerState>>) {
  useEffect(() => {
    const timerId = window.setInterval(() => {
    // This line is called a functional State Update
      setState((previous) => {
        const nextFill = Math.min(
    // Cap fill at
          1,
          previous.qi.fill + computeQiFillRate(previous),
        );

        return {
          ...previous,
          qi: {
            ...previous.qi,
            fill: nextFill,
          },
        };
      });
    }, TICK_MS);

    return () => window.clearInterval(timerId);
  }, [setState]);
}