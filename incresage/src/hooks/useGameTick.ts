import { useEffect, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { PlayerState } from '../types/state';
import { computeQiFillRate } from '../utils/fillRate';
import { addTechniqueExp } from '../utils/techniqueUtils';
import { computeInsightGainPerTick, getInsightCap } from '../utils/insightUtils';
import { computeLifespanDrain } from '../utils/lifespanUtils';
import { buildReincarnationSummary } from '../utils/reincarnationUtils';

const TICK_MS = 1000;

export function useGameTick(
  setState: Dispatch<SetStateAction<PlayerState>>,
  onDeath?: () => void,
) {
  // Use ref to keep the callback stable and avoid re-creating the interval on every render
  const onDeathRef = useRef(onDeath);
  onDeathRef.current = onDeath;

  useEffect(() => {
    const timerId = window.setInterval(() => {
    // This line is called a functional State Update
      setState((previous) => {
        // Don't process ticks if pending death/rebirth
        if (previous.legacy.pendingSummary) return previous;

        const nextFill = Math.min(
    // Cap fill at
          1,
          previous.qi.fill + computeQiFillRate(previous),
        );

        const nextTechniques = previous.qi.techniques.map((technique) => {
          if(technique.id !== previous.qi.activeTechniqueId) return technique;
          return addTechniqueExp(technique, 1); // Gain 1 exp per tick for the active technique
        });

        const nextInsight = Math.min(
          getInsightCap(previous),
          previous.qi.insight + computeInsightGainPerTick(previous),
        );

        // Lifespan drain
        const drain = computeLifespanDrain(previous);
        const nextLifespanFill = Math.min(1, previous.life.lifespanFill + drain);

        // Check for death
        const hasDied = nextLifespanFill >= 1 && !previous.legacy.pendingSummary;

        if (hasDied) {
          const summary = buildReincarnationSummary({
            ...previous,
            life: {
              ...previous.life,
              lifespanFill: nextLifespanFill,
            },
          });

          // Notify death on next tick
          setTimeout(() => onDeathRef.current?.(), 0);

          return {
            ...previous,
            qi: {
              ...previous.qi,
              fill: nextFill,
              techniques: nextTechniques,
              insight: nextInsight,
            },
            life: {
              ...previous.life,
              lifespanFill: nextLifespanFill,
              lastUpdate: Date.now(),
            },
            legacy: {
              ...previous.legacy,
              pendingSummary: summary,
            },
          };
        }

        return {
          ...previous,
          qi: {
            ...previous.qi,
            fill: nextFill,
            techniques: nextTechniques,
            insight: nextInsight,
          },
          life: {
            ...previous.life,
            lifespanFill: nextLifespanFill,
            lastUpdate: Date.now(),
          },
        };
      });
    }, TICK_MS);

    return () => window.clearInterval(timerId);
  }, [setState]); // onDeath removed — using ref instead to prevent interval resets
}