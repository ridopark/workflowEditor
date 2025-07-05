import { useState, useCallback } from 'react';
import type { Node, Edge } from '@xyflow/react';

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
}

interface UndoRedoHook {
  takeSnapshot: (nodes: Node[], edges: Edge[]) => void;
  undo: () => WorkflowState | null;
  redo: () => WorkflowState | null;
  canUndo: boolean;
  canRedo: boolean;
  historySize: number;
  currentIndex: number;
  clearHistory: () => void;
}

export const useUndoRedo = (): UndoRedoHook => {
  const [history, setHistory] = useState<WorkflowState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const takeSnapshot = useCallback((nodes: Node[], edges: Edge[]) => {
    const newState: WorkflowState = {
      nodes: JSON.parse(JSON.stringify(nodes)), // Deep clone
      edges: JSON.parse(JSON.stringify(edges))  // Deep clone
    };

    setHistory(prev => {
      // Remove any future history if we're not at the end
      const newHistory = prev.slice(0, currentIndex + 1);
      // Add new state
      newHistory.push(newState);
      
      // Limit history size to prevent memory issues (keep last 50 states)
      const maxHistorySize = 50;
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        setCurrentIndex(prev => prev); // Keep same relative position
        return newHistory;
      }
      
      setCurrentIndex(newHistory.length - 1);
      return newHistory;
    });

    console.log('📸 Undo/Redo snapshot taken');
  }, [currentIndex]);

  const undo = useCallback((): WorkflowState | null => {
    if (currentIndex <= 0) return null;

    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    const previousState = history[newIndex];
    
    console.log('↶ Undo to state', newIndex + 1, 'of', history.length);
    return previousState;
  }, [currentIndex, history]);

  const redo = useCallback((): WorkflowState | null => {
    if (currentIndex >= history.length - 1) return null;

    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    const nextState = history[newIndex];
    
    console.log('↷ Redo to state', newIndex + 1, 'of', history.length);
    return nextState;
  }, [currentIndex, history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
    console.log('🗑️ Undo/Redo history cleared');
  }, []);

  return {
    takeSnapshot,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    historySize: history.length,
    currentIndex,
    clearHistory
  };
};
