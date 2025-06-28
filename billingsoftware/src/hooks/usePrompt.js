import { useContext, useEffect } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';

export function usePrompt(when, message = 'You have unsaved changes. Are you sure you want to leave?') {
  const navigator = useContext(NavigationContext).navigator;

  useEffect(() => {
    if (!when) return;

    const originalPush = navigator.push;
    const originalReplace = navigator.replace;

    const blocker = (method) => (...args) => {
      const confirmLeave = window.confirm(message);
      if (confirmLeave) {
        navigator.push = originalPush;
        navigator.replace = originalReplace;
        method(...args);
      }
    };

    navigator.push = blocker(originalPush);
    navigator.replace = blocker(originalReplace);

    return () => {
      navigator.push = originalPush;
      navigator.replace = originalReplace;
    };
  }, [when, message, navigator]);
}
