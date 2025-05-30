import * as Device from 'expo-device';
import React, { createContext, useContext, useState } from 'react';

export interface MidiDevice {
  id: string;
  name: string;
}

interface MidiContextType {
  devices: MidiDevice[];
  connectedDevice: MidiDevice | null;
  keyboard: any;
  connectToDevice: (device: MidiDevice) => Promise<boolean>;
  disconnectFromDevice: () => void;
  refreshDevices: () => void;
}

const MidiContext = createContext<MidiContextType | null>(null);

// Mock device for simulator
const mockDevice: MidiDevice = {
  id: 'mock',
  name: 'Mock Device',
};

const mockKeyboard = {
  playNote: async (note: number, velocity: number) => {
    console.log(`Playing note ${note} with velocity ${velocity}`);
  },
  releaseNote: async (note: number) => {
    console.log(`Releasing note ${note}`);
  },
};

export function MidiProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<MidiDevice[]>([]);
  const [_connectedDevice, _setConnectedDevice] = useState<MidiDevice | null>(null);
  const [_keyboard, _setKeyboard] = useState<any>(null);

  // In simulator, always use mock device
  const connectedDevice = Device.isDevice ? _connectedDevice : mockDevice;
  const keyboard = Device.isDevice ? _keyboard : mockKeyboard;

  const refreshDevices = () => {
    if (Device.isDevice) {
      // Real device implementation would go here
      setDevices([]);
    } else {
      // In simulator, always show mock device
      setDevices([mockDevice]);
    }
  };

  const connectToDevice = async (device: MidiDevice): Promise<boolean> => {
    if (Device.isDevice) {
      // Real device implementation would go here
      _setConnectedDevice(device);
      _setKeyboard({
        playNote: async (note: number, velocity: number) => {
          console.log(`Playing note ${note} with velocity ${velocity}`);
        },
        releaseNote: async (note: number) => {
          console.log(`Releasing note ${note}`);
        },
      });
      return true;
    } else {
      // In simulator, always succeed with mock device
      return true;
    }
  };

  const disconnectFromDevice = () => {
    if (Device.isDevice) {
      _setConnectedDevice(null);
      _setKeyboard(null);
    }
    // In simulator, do nothing - mock device stays connected
  };

  return (
    <MidiContext.Provider 
      value={{ 
        devices, 
        connectedDevice, 
        keyboard,
        connectToDevice,
        disconnectFromDevice,
        refreshDevices,
      }}
    >
      {children}
    </MidiContext.Provider>
  );
}

export function useMidi() {
  const context = useContext(MidiContext);
  if (!context) {
    throw new Error('useMidi must be used within a MidiProvider');
  }
  return context;
} 