import { useState, useCallback, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import type { SystemCard } from '@shared/types';
interface HistoryState {
  past: Partial<SystemCard>[];
  present: Partial<SystemCard>;
  future: Partial<SystemCard>[];
}
export function useEditorHistory(initialState: Partial<SystemCard>) {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: initialState,
    future: [],
  });
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;
  const undo = useCallback(() => {
    if (!canUndo) return;
    setHistory((curr) => {
      const previous = curr.past[curr.past.length - 1];
      const newPast = curr.past.slice(0, curr.past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [curr.present, ...curr.future],
      };
    });
  }, [canUndo]);
  const redo = useCallback(() => {
    if (!canRedo) return;
    setHistory((curr) => {
      const next = curr.future[0];
      const newFuture = curr.future.slice(1);
      return {
        past: [...curr.past, curr.present],
        present: next,
        future: newFuture,
      };
    });
  }, [canRedo]);
  const push = useCallback((newState: Partial<SystemCard>) => {
    setHistory((curr) => {
      // Don't push if no change
      if (JSON.stringify(curr.present) === JSON.stringify(newState)) return curr;
      return {
        past: [...curr.past, curr.present].slice(-50), // limit history
        present: newState,
        future: [],
      };
    });
  }, []);
  const reset = useCallback((state: Partial<SystemCard>) => {
    setHistory({
      past: [],
      present: state,
      future: [],
    });
  }, []);
  useHotkeys('mod+z', (e) => {
    e.preventDefault();
    undo();
  }, { enableOnFormTags: true });
  useHotkeys('mod+shift+z', (e) => {
    e.preventDefault();
    redo();
  }, { enableOnFormTags: true });
  useHotkeys('mod+y', (e) => {
    e.preventDefault();
    redo();
  }, { enableOnFormTags: true });
  return {
    state: history.present,
    push,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
  };
}