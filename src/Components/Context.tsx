import React, { createContext, useState } from "react";

const SearchContext = createContext<any>(null);

const SearchProvider = ({ children }: any) => {
  const [totalWords, setTotalWords] = useState<string[]>([]);

  const addSearchWord = (newWord: string) => {
    setTotalWords([...totalWords, newWord]);
  };

  return (
    <SearchContext.Provider value={{ totalWords, addSearchWord }}>
      {children}
    </SearchContext.Provider>
  );
};



export { SearchContext, SearchProvider };
