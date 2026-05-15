import { getData } from "@/services/storage";
import { createContext, useEffect, useState } from "react";

export const BestScoreContext = createContext();

export function BestScoreProvider({ children }) {
  const [best, setBest] = useState(0);

  useEffect(() => {
    const loadBest = async () => {
      const value = await getData();

      setBest(value);
    };

    loadBest();
  }, []);

  return (
    <BestScoreContext.Provider value={{ best, setBest }}>
      {children}
    </BestScoreContext.Provider>
  );
}
