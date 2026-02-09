'use client';

import React, { createContext, useState, useContext } from 'react';

import { type Driver, drivers } from '@/models';

interface AppContextProps {
  drivers: Record<string, Driver>;
  setDrivers: (driverId: string, driver: Driver) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [driversState, setDriversState] = useState<Record<string, Driver>>(drivers);

  const setDrivers = (driverId: string, driver: Driver) => {
    setDriversState((prev) => ({ ...prev, [driverId]: driver }));
  };

  return (
    <AppContext.Provider
      value={{
        drivers: driversState,
        setDrivers
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
