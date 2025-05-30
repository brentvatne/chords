import * as Device from "expo-device";
import React, { createContext, useContext, useEffect, useState } from "react";
import { MidiDevice, MidiKeyboard } from "../modules/simple-midi";

interface MidiContextType {
  devices: MidiDevice[];
  connectedDevice: MidiDevice | null;
  keyboard: MidiKeyboard;
  connectToDevice: (deviceId: string) => Promise<boolean>;
  disconnect: () => Promise<void>;
  refreshDevices: () => Promise<void>;
}

const MidiContext = createContext<MidiContextType | undefined>(undefined);

export const keyboard = new MidiKeyboard();

const USE_MOCK_DEVICE = false;

export function MidiProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<MidiDevice[]>([]);
  const [_connectedDevice, _setConnectedDevice] = useState<MidiDevice | null>(
    null,
  );

  // Mock device for simulator
  const mockDevice = {
    id: "mock",
    name: "Mock Device",
    isConnected: true,
  };

  const connectedDevice = Device.isDevice ? _connectedDevice : mockDevice;

  const fetchDevices = async () => {
    try {
      console.log("Fetching MIDI devices...");
      const devices = await keyboard.getDevices();
      console.log("Found MIDI devices:", devices);
      setDevices(devices);
    } catch (error) {
      console.error("Error fetching MIDI devices:", error);
    }
  };

  const connectToDevice = async (deviceId: string) => {
    try {
      console.log("Attempting to connect to device:", deviceId);
      const connected = await keyboard.connect(deviceId);
      console.log("Connection result:", connected);
      if (connected) {
        const device = devices.find((d) => d.id === deviceId);
        if (device) {
          _setConnectedDevice(device);
        }
      }
      return connected;
    } catch (error) {
      console.error("Error connecting to device:", error);
      return false;
    }
  };

  const disconnect = async () => {
    try {
      await keyboard.disconnect();
      _setConnectedDevice(null);
    } catch (error) {
      console.error("Error disconnecting:", error);
      throw error;
    }
  };

  useEffect(() => {
    console.log("MidiContext initializing...");
    fetchDevices();

    keyboard.addDeviceListener(
      (deviceId, deviceName) => {
        console.log("Device connected:", deviceId, deviceName);
        fetchDevices();
      },
      (deviceId, deviceName) => {
        console.log("Device disconnected:", deviceId, deviceName);
        fetchDevices();
      },
      (devices) => {
        console.log("Devices changed:", devices);
        setDevices(devices);
      },
    );

    return () => {
      console.log("MidiContext cleaning up...");
      keyboard.disconnect();
    };
  }, []);

  const value: MidiContextType = {
    devices,
    connectedDevice,
    keyboard,
    connectToDevice,
    disconnect,
    refreshDevices: fetchDevices,
  };

  return <MidiContext.Provider value={value}>{children}</MidiContext.Provider>;
}

export function useMidi() {
  const context = useContext(MidiContext);
  if (context === undefined) {
    throw new Error("useMidi must be used within a MidiProvider");
  }
  return context;
}
