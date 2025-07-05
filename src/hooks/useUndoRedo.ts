import { useReducer, useCallback } from 'react';
import type { Node, Edge } from '@xyflow/react';

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
}

interface UndoRedoState {
  history: WorkflowState[];
  currentIndex: number;
}

type UndoRedoAction = 
  | { type: 'TAKE_SNAPSHOT'; payload: WorkflowState }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR' };

const undoRedoReducer = (state: UndoRedoState, action: UndoRedoAction): UndoRedoState => {
  switch (action.type) {
    case 'TAKE_SNAPSHOT': {
      // Remove any future history if we're not at the end
      const newHistory = state.history.slice(0, state.currentIndex + 1);
      
      // Add new state
      newHistory.push(action.payload);
      
      // Limit history size to prevent memory issues (keep last 50 states)
      const maxHistorySize = 50;
      if (newHistory.length > maxHistorySize) {
        return {
          history: newHistory.slice(-maxHistorySize),
          currentIndex: maxHistorySize - 1
        };
      }
      
      return {
        history: newHistory,
        currentIndex: newHistory.length - 1
      };
    }
    
    case 'UNDO': {
      if (state.currentIndex <= 0) return state;
      
      return {
        ...state,
        currentIndex: state.currentIndex - 1
      };
    }
    
    case 'REDO': {
      if (state.currentIndex >= state.history.length - 1) return state;
      
      return {
        ...state,
        currentIndex: state.currentIndex + 1
      };
    }
    
    case 'CLEAR': {
      return {
        history: [],
        currentIndex: -1
      };
    }
    
    default:
      return state;
  }
};

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
  const [state, dispatch] = useReducer(undoRedoReducer, {
    history: [],
    currentIndex: -1
  });

  const takeSnapshot = useCallback((nodes: Node[], edges: Edge[]) => {
    const newState: WorkflowState = {
      nodes: JSON.parse(JSON.stringify(nodes)), // Deep clone
      edges: JSON.parse(JSON.stringify(edges))  // Deep clone
    };

    console.log('� Taking snapshot:', {
      currentIndex: state.currentIndex,
      historyLength: state.history.length,
      nodeCount: nodes.length,
      edgeCount: edges.length
    });

    dispatch({ type: 'TAKE_SNAPSHOT', payload: newState });
  }, [state.currentIndex, state.history.length]);

  const undo = useCallback((): WorkflowState | null => {
    console.log('🔙 Undo called:', {
      currentIndex: state.currentIndex,
      historyLength: state.history.length,
      canUndo: state.currentIndex > 0
    });

    if (state.currentIndex <= 0) {
      console.log('❌ Cannot undo: at beginning of history');
      return null;
    }

    dispatch({ type: 'UNDO' });
    const newIndex = state.currentIndex - 1;
    const previousState = state.history[newIndex];
    
    console.log('↶ Undo to state', newIndex + 1, 'of', state.history.length, {
      nodeCount: previousState?.nodes.length || 0,
      edgeCount: previousState?.edges.length || 0
    });
    return previousState;
  }, [state.currentIndex, state.history]);

  const redo = useCallback((): WorkflowState | null => {
    console.log('🔜 Redo called:', {
      currentIndex: state.currentIndex,
      historyLength: state.history.length,
      canRedo: state.currentIndex < state.history.length - 1
    });

    if (state.currentIndex >= state.history.length - 1) {
      console.log('❌ Cannot redo: at end of history');
      return null;
    }

    dispatch({ type: 'REDO' });
    const newIndex = state.currentIndex + 1;
    const nextState = state.history[newIndex];
    
    console.log('↷ Redo to state', newIndex + 1, 'of', state.history.length, {
      nodeCount: nextState?.nodes.length || 0,
      edgeCount: nextState?.edges.length || 0
    });
    return nextState;
  }, [state.currentIndex, state.history]);

  const clearHistory = useCallback(() => {
    dispatch({ type: 'CLEAR' });
    console.log('🗑️ Undo/Redo history cleared');
  }, []);

  return {
    takeSnapshot,
    undo,
    redo,
    canUndo: state.currentIndex > 0,
    canRedo: state.currentIndex < state.history.length - 1,
    historySize: state.history.length,
    currentIndex: state.currentIndex,
    clearHistory
  };
};
