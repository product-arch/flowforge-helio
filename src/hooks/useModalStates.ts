import { useState } from 'react';

export interface ModalStates {
  personalInfoOpen: boolean;
  accountSettingsOpen: boolean;
  billingOpen: boolean;
  supportOpen: boolean;
  settingsOpen: boolean;
  accountOpen: boolean;
  simulationOpen: boolean;
  configurationOpen: boolean;
}

export interface ModalActions {
  setPersonalInfoOpen: (open: boolean) => void;
  setAccountSettingsOpen: (open: boolean) => void;
  setBillingOpen: (open: boolean) => void;
  setSupportOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setAccountOpen: (open: boolean) => void;
  setSimulationOpen: (open: boolean) => void;
  setConfigurationOpen: (open: boolean) => void;
  closeAllModals: () => void;
}

export type UseModalStatesReturn = ModalStates & ModalActions;

export const useModalStates = (): UseModalStatesReturn => {
  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [simulationOpen, setSimulationOpen] = useState(false);
  const [configurationOpen, setConfigurationOpen] = useState(false);

  const closeAllModals = () => {
    setPersonalInfoOpen(false);
    setAccountSettingsOpen(false);
    setBillingOpen(false);
    setSupportOpen(false);
    setSettingsOpen(false);
    setAccountOpen(false);
    setSimulationOpen(false);
    setConfigurationOpen(false);
  };

  return {
    personalInfoOpen,
    accountSettingsOpen,
    billingOpen,
    supportOpen,
    settingsOpen,
    accountOpen,
    simulationOpen,
    configurationOpen,
    setPersonalInfoOpen,
    setAccountSettingsOpen,
    setBillingOpen,
    setSupportOpen,
    setSettingsOpen,
    setAccountOpen,
    setSimulationOpen,
    setConfigurationOpen,
    closeAllModals,
  };
};