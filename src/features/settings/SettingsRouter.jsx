import React from 'react';
import SettingsMainScreen from './screens/SettingsMainScreen';

export default function SettingsRouter() {
  // Untuk saat ini hanya ada satu layar utama, 
  // tapi struktur ini siap jika nanti ada sub-layar seperti "Edit Profil"
  return <SettingsMainScreen />;
}
