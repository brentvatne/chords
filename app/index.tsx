import { Ionicons } from "@expo/vector-icons";
import * as Device from 'expo-device';
import { useEffect, useState } from "react";
import { Button, Pressable, Text, View } from "react-native";
import { Chord, Note } from "tonal";
import { MidiDevice, MidiKeyboard } from "../modules/simple-midi";

type ChordQuality = 'major' | 'minor' | 'diminished' | 'augmented' | 'dominant' | 'minor-seventh' | 'major-seventh' | 'diminished-seventh' | 'augmented-seventh';

type MusicalNote = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';
type MusicalNoteWithOctave = `${MusicalNote}${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;

function chordToMidiNotes(quality: ChordQuality, root: MusicalNoteWithOctave): number[] {
  const midiNotes = Chord.notes(quality, root).map(note => Note.midi(note)).filter((note): note is number => note !== null);
  if (midiNotes.length !== 3) {
    throw new Error(`Invalid chord: ${quality} ${root}`);
  }
  return midiNotes;
}

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

async function playNotesAsync(midiNotes: number[], velocity: number, duration: number) {
  for (const note of midiNotes) {
    await keyboard.playNote(note, velocity);
  }
  setTimeout(async () => {
    for (const note of midiNotes) {
      await keyboard.releaseNote(note);
    }
  }, duration);
}

export default function Index() {
  const [ devices, fetchDevices ] = useDevices();
  const [_connectedDevice, _setConnectedDevice] = useState<MidiDevice | null>(null);

  const mockDevice = {
    id: 'mock',
    name: 'Mock Device',
    isConnected: true,
  };

  const connectedDevice = Device.isDevice ? _connectedDevice : mockDevice;

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
              _setConnectedDevice(null);
            } catch {
              alert("Failed to disconnect from device");
            }
          }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 100 }} />
          <Button title="Play C Major Chord" onPress={async () => {
            const chord = chordToMidiNotes('major', 'C4');
            console.log(chord);
            await playNotesAsync(chord, 100, 1000);
          }} />
          <Keyboard />
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
                    _setConnectedDevice(device);
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


function Keyboard() {
  return (
    <View style={{ width: '100%', aspectRatio: 7/2, flexDirection: 'row' }}>
      {/* White keys */}
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 1, borderWidth: 1, borderColor: '#000', backgroundColor: '#fff', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 10 }}>
          <Text>C</Text>
        </View>
        <View style={{ flex: 1, borderWidth: 1, borderColor: '#000', backgroundColor: '#fff', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 10 }}>
          <Text>D</Text>
        </View>
        <View style={{ flex: 1, borderWidth: 1, borderColor: '#000', backgroundColor: '#fff', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 10 }}>
          <Text>E</Text>
        </View>
        <View style={{ flex: 1, borderWidth: 1, borderColor: '#000', backgroundColor: '#fff', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 10 }}>
          <Text>F</Text>
        </View>
        <View style={{ flex: 1, borderWidth: 1, borderColor: '#000', backgroundColor: '#fff', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 10 }}>
          <Text>G</Text>
        </View>
        <View style={{ flex: 1, borderWidth: 1, borderColor: '#000', backgroundColor: '#fff', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 10 }}>
          <Text>A</Text>
        </View>
        <View style={{ flex: 1, borderWidth: 1, borderColor: '#000', backgroundColor: '#fff', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 10 }}>
          <Text>B</Text>
        </View>
      </View>

      {/* Black keys overlay */}
      <View style={{ position: 'absolute', width: '100%', height: '60%', flexDirection: 'row', paddingLeft: '8.5%' }}>
        <View style={{ width: '10%', height: '100%', backgroundColor: '#000', marginRight: '5%' }}>
          <Text style={{ color: '#fff', position: 'absolute', bottom: 10, alignSelf: 'center' }}>C#</Text>
        </View>
        <View style={{ width: '10%', height: '100%', backgroundColor: '#000', marginRight: '13%' }}>
          <Text style={{ color: '#fff', position: 'absolute', bottom: 10, alignSelf: 'center' }}>D#</Text>
        </View>
        <View style={{ width: '10%', height: '100%', backgroundColor: '#000', marginRight: '5%' }}>
          <Text style={{ color: '#fff', position: 'absolute', bottom: 10, alignSelf: 'center' }}>F#</Text>
        </View>
        <View style={{ width: '10%', height: '100%', backgroundColor: '#000', marginRight: '5%' }}>
          <Text style={{ color: '#fff', position: 'absolute', bottom: 10, alignSelf: 'center' }}>G#</Text>
        </View>
        <View style={{ width: '10%', height: '100%', backgroundColor: '#000' }}>
          <Text style={{ color: '#fff', position: 'absolute', bottom: 10, alignSelf: 'center' }}>A#</Text>
        </View>
      </View>
    </View>
  );
}