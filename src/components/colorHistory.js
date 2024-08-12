export const addColorToHistory = (history, colors) => {
    const newHistory = [...history, colors];
    return newHistory;
  };
  
  export const getPreviousColors = (history) => {
    if (history.length > 1) {
      const previousColors = history[history.length - 2];
      const newHistory = history.slice(0, history.length - 1);
      return { previousColors, newHistory };
    }
    return { previousColors: history[0], newHistory: [history[0]] };
  };
  