import { useEffect } from 'react';

interface KeyboardShortcuts {
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onDelete?: () => void;
  onSelectAll?: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { ctrlKey, metaKey, shiftKey, key } = event;
      const isCtrlOrCmd = ctrlKey || metaKey;

      // Prevent default browser shortcuts when we handle them
      if (isCtrlOrCmd) {
        switch (key.toLowerCase()) {
          case 'z':
            event.preventDefault();
            if (shiftKey && shortcuts.onRedo) {
              shortcuts.onRedo();
            } else if (!shiftKey && shortcuts.onUndo) {
              shortcuts.onUndo();
            }
            break;
            
          case 'y':
            if (!shiftKey && shortcuts.onRedo) {
              event.preventDefault();
              shortcuts.onRedo();
            }
            break;
            
          case 's':
            if (shortcuts.onSave) {
              event.preventDefault();
              shortcuts.onSave();
            }
            break;
            
          case 'c':
            if (shortcuts.onCopy) {
              event.preventDefault();
              shortcuts.onCopy();
            }
            break;
            
          case 'v':
            if (shortcuts.onPaste) {
              event.preventDefault();
              shortcuts.onPaste();
            }
            break;
            
          case 'a':
            if (shortcuts.onSelectAll) {
              event.preventDefault();
              shortcuts.onSelectAll();
            }
            break;
        }
      }

      // Delete key (without Ctrl/Cmd)
      if (key === 'Delete' || key === 'Backspace') {
        if (shortcuts.onDelete) {
          event.preventDefault();
          shortcuts.onDelete();
        }
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
};
