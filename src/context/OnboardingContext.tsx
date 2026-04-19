import React, { createContext, useContext, useState } from 'react';

export type Gender = 'female' | 'male' | 'other';
export type Preference = 'mixed' | 'men' | 'women';

interface OnboardingState {
  phone: string;
  name: string;
  gender: Gender | null;
  birthday: Date | null;
  sports: string[];
  photos: string[];
  city: string;
  description: string;
  preference: Preference | null;
}

interface OnboardingContextValue {
  data: OnboardingState;
  update: (patch: Partial<OnboardingState>) => void;
}

const initial: OnboardingState = {
  phone: '',
  name: '',
  gender: null,
  birthday: null,
  sports: [],
  photos: [],
  city: '',
  description: '',
  preference: null,
};

const OnboardingContext = createContext<OnboardingContextValue>({
  data: initial,
  update: () => {},
});

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<OnboardingState>(initial);
  const update = (patch: Partial<OnboardingState>) =>
    setData(prev => ({ ...prev, ...patch }));

  return (
    <OnboardingContext.Provider value={{ data, update }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);
