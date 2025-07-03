import { useState, useCallback, useRef } from 'react';
import type { Node, Edge } from 'reactflow';

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

interface UseUndoRedoOptions {
  maxHistorySize?: number;
}

export const useUndoRedo = (
  initialNodes: Node[],
  initialEdges: Edge[],
  options: UseUndoRedoOptions = {}
) => {
  const { maxHistorySize = 50 } = options;
  
  // History state management
  const [history, setHistory] = useState<HistoryState[]>([
    { nodes: initialNodes, edges: initialEdges }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isRedoUndoRef = useRef(false);

  // Get current state
  const currentState = history[currentIndex];

  // Add new state to history
  const takeSnapshot = useCallback((nodes: Node[], edges: Edge[]) => {
    // Don't add to history if we're in the middle of undo/redo
    if (isRedoUndoRef.current) {
      isRedoUndoRef.current = false;
      return;
    }

    setHistory(prev => {
      // Remove any future history if we're not at the end
      const newHistory = prev.slice(0, currentIndex + 1);
      
      // Add new state
      const newState = { nodes: [...nodes], edges: [...edges] };
      newHistory.push(newState);
      
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        setCurrentIndex(newHistory.length - 1);
      } else {
        setCurrentIndex(newHistory.length - 1);
      }
      
      return newHistory;
    });
  }, [currentIndex, maxHistorySize]);

  // Undo functionality
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      isRedoUndoRef.current = true;
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [currentIndex, history]);

  // Redo functionality
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      isRedoUndoRef.current = true;
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [currentIndex, history]);

  // Check if undo/redo is available
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([currentState]);
    setCurrentIndex(0);
  }, [currentState]);

  return {
    takeSnapshot,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    currentState,
    historySize: history.length,
    currentIndex
  };
};
