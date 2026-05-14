import { useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { PlayerState } from '../types/state';
import { computeQiFillRate } from '../utils/fillRate';
import { addTechniqueExp } from '../utils/techniqueUtils';

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

        const nextTechniques = previous.qi.techniques.map((technique) => {
          if(technique.id !== previous.qi.activeTechniqueId) return technique;
          return addTechniqueExp(technique, 1); // Gain 1 exp per tick for the active technique
        });

        return {
          ...previous,
          qi: {
            ...previous.qi,
            fill: nextFill,
            techniques: nextTechniques,
          },
        };
      });
    }, TICK_MS);

    return () => window.clearInterval(timerId);
  }, [setState]);
}