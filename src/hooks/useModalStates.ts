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
  notificationsOpen: boolean;
  languageOpen: boolean;
  privacyOpen: boolean;
  dataManagementOpen: boolean;
  keyboardShortcutsOpen: boolean;
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
  setNotificationsOpen: (open: boolean) => void;
  setLanguageOpen: (open: boolean) => void;
  setPrivacyOpen: (open: boolean) => void;
  setDataManagementOpen: (open: boolean) => void;
  setKeyboardShortcutsOpen: (open: boolean) => void;
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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [dataManagementOpen, setDataManagementOpen] = useState(false);
  const [keyboardShortcutsOpen, setKeyboardShortcutsOpen] = useState(false);

  const closeAllModals = () => {
    setPersonalInfoOpen(false);
    setAccountSettingsOpen(false);
    setBillingOpen(false);
    setSupportOpen(false);
    setSettingsOpen(false);
    setAccountOpen(false);
    setSimulationOpen(false);
    setConfigurationOpen(false);
    setNotificationsOpen(false);
    setLanguageOpen(false);
    setPrivacyOpen(false);
    setDataManagementOpen(false);
    setKeyboardShortcutsOpen(false);
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
    notificationsOpen,
    languageOpen,
    privacyOpen,
    dataManagementOpen,
    keyboardShortcutsOpen,
    setPersonalInfoOpen,
    setAccountSettingsOpen,
    setBillingOpen,
    setSupportOpen,
    setSettingsOpen,
    setAccountOpen,
    setSimulationOpen,
    setConfigurationOpen,
    setNotificationsOpen,
    setLanguageOpen,
    setPrivacyOpen,
    setDataManagementOpen,
    setKeyboardShortcutsOpen,
    closeAllModals,
  };
};