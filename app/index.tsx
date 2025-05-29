import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Button, Pressable, Text, View } from "react-native";
import { MidiDevice, MidiKeyboard } from "../modules/simple-midi";

const keyboard = new MidiKeyboard();

function useDevices(): [MidiDevice[], () => Promise<void>] {
  const [devices, setDevices] = useState<MidiDevice[]>([]);

  const fetchDevices = async () => {
    const devices = await keyboard.getDevices();
    setDevices(devices);
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
  }, [setDevices]);

  return [ devices, fetchDevices ];
}

async function playMajorChordAsync(rootNote: number, velocity: number, duration: number) {
    // Play a C major chord
    await keyboard.playNote(rootNote, velocity); // root
    await keyboard.playNote(rootNote + 4, velocity); // 3rd
    await keyboard.playNote(rootNote + 7, velocity); // 5th
    
    // Hold for 1 second
    setTimeout(async () => {
      await keyboard.releaseNote(rootNote);
      await keyboard.releaseNote(rootNote + 4);
      await keyboard.releaseNote(rootNote + 7);
    }, duration);
  };

export default function Index() {
  const [ devices, fetchDevices ] = useDevices();
  const [connectedDevice, setConnectedDevice] = useState<MidiDevice | null>(null);


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {connectedDevice ? (
        <View>
          <Text>Connected to {connectedDevice.name}</Text>
          <Button title="Disconnect" onPress={async () => {
            try {
              await keyboard.disconnect();
              setConnectedDevice(null);
            } catch {
              alert("Failed to disconnect from device");
            }
          }} />
          <Button title="Play C Major Chord" onPress={async () => {
            await playMajorChordAsync(60, 100, 100);
          }} />
        </View>
      ) : (
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginRight: 10 }}>Devices ({devices.length})</Text>
            <Pressable onPress={() => fetchDevices()} style={{ padding: 5, backgroundColor: "lightgray", borderRadius: 5 }}>
              <Ionicons name="refresh" size={18} color="black" style={{ transform: [{ rotate: "0deg" }] }} />
            </Pressable>
          </View>
          {devices.length > 0 ? devices.map((device) => (
            <View key={device.id}>
              <Text>{device.name}</Text>
              <Button title="Connect" onPress={async () => {
                try {
                  const connected = await keyboard.connect(device.id);
                  if (connected) {
                    setConnectedDevice(device);
                  } else {
                    throw null;
                  }
                } catch {
                  alert("Failed to connect to device");
                }
              }} />
            </View>
          )) : <Text>No devices found</Text>}
        </View>
      )}
    </View>
  );
}
