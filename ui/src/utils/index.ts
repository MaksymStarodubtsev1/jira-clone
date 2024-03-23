import { useEffect, useState } from "react";

export const useDebounce = (value: any, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState("");
  
    useEffect(() => {
      const cancell = setTimeout(() => setDebouncedValue(value), delay);
  
      return () => {
        clearTimeout(cancell);
      };
    }, [value, delay]);
  
    return debouncedValue;
  };