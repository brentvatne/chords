import * as Device from 'expo-device';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { MidiDevice, MidiKeyboard } from '../modules/simple-midi';

interface MidiContextType {
  devices: MidiDevice[];
  connectedDevice: MidiDevice | null;
  keyboard: MidiKeyboard;
  connectToDevice: (deviceId: string) => Promise<boolean>;
  disconnect: () => Promise<void>;
  refreshDevices: () => Promise<void>;
}

const MidiContext = createContext<MidiContextType | undefined>(undefined);

const keyboard = new MidiKeyboard();

export function MidiProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<MidiDevice[]>([]);
  const [_connectedDevice, _setConnectedDevice] = useState<MidiDevice | null>(null);

  // Mock device for simulator
  const mockDevice = {
    id: 'mock',
    name: 'Mock Device',
    isConnected: true,
  };

  const connectedDevice = Device.isDevice ? _connectedDevice : mockDevice;

  const fetchDevices = async () => {
    const devices = await keyboard.getDevices();
    setDevices(devices);
  };

  const connectToDevice = async (deviceId: string) => {
    try {
      const connected = await keyboard.connect(deviceId);
      if (connected) {
        const device = devices.find(d => d.id === deviceId);
        if (device) {
          _setConnectedDevice(device);
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  };

  const disconnect = async () => {
    try {
      await keyboard.disconnect();
      _setConnectedDevice(null);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchDevices();

    keyboard.addDeviceListener(
      () => {
        fetchDevices();
      },
      () => {
        fetchDevices();
      },
      (devices) => {
        setDevices(devices);
      }
    );
  }, []);

  const value: MidiContextType = {
    devices,
    connectedDevice,
    keyboard,
    connectToDevice,
    disconnect,
    refreshDevices: fetchDevices,
  };

  return (
    <MidiContext.Provider value={value}>
      {children}
    </MidiContext.Provider>
  );
}

export function useMidi() {
  const context = useContext(MidiContext);
  if (context === undefined) {
    throw new Error('useMidi must be used within a MidiProvider');
  }
  return context;
} 