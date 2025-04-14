/** @format */

// src/context/UserContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  points?: number;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
