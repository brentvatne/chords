import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {
    MidiDevice,
    MidiKeyboard,
    noteToName
} from '../';

const KeyboardKey: React.FC<{
  note: number;
  isBlack?: boolean;
  onPress: (note: number) => void;
  onRelease: (note: number) => void;
  isPressed: boolean;
}> = ({ note, isBlack = false, onPress, onRelease, isPressed }) => {
  return (
    <TouchableOpacity
      style={[
        styles.key,
        isBlack ? styles.blackKey : styles.whiteKey,
        isPressed && (isBlack ? styles.blackKeyPressed : styles.whiteKeyPressed),
      ]}
      onPressIn={() => onPress(note)}
      onPressOut={() => onRelease(note)}
      activeOpacity={1}
    >
      <Text style={[styles.keyText, isBlack && styles.blackKeyText]}>
        {noteToName(note)}
      </Text>
    </TouchableOpacity>
  );
};

export const MidiKeyboardExample: React.FC = () => {
  const [midiKeyboard] = useState(() => new MidiKeyboard());
  const [devices, setDevices] = useState<MidiDevice[]>([]);
  const [connected, setConnected] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [pressedKeys, setPressedKeys] = useState<Set<number>>(new Set());
  const [velocity, setVelocity] = useState(64);
  const [octave, setOctave] = useState(4);

  useEffect(() => {
    // Load MIDI devices
    loadDevices();

    // Set up device listeners
    const cleanup = midiKeyboard.addDeviceListener(
      (deviceId, deviceName) => {
        Alert.alert('Device Connected', `Connected to ${deviceName}`);
        setConnected(true);
        setSelectedDevice(deviceId);
      },
      (deviceId, deviceName) => {
        Alert.alert('Device Disconnected', `Disconnected from ${deviceName}`);
        setConnected(false);
        setSelectedDevice(null);
      },
      (devices) => {
        setDevices(devices);
      }
    );

    return () => {
      cleanup();
      midiKeyboard.disconnect();
    };
  }, []);

  const loadDevices = async () => {
    try {
      const deviceList = await midiKeyboard.getDevices();
      setDevices(deviceList);
    } catch (error) {
      Alert.alert('Error', 'Failed to load MIDI devices');
    }
  };

  const connectToDevice = async (deviceId: string) => {
    try {
      const success = await midiKeyboard.connect(deviceId);
      if (success) {
        setConnected(true);
        setSelectedDevice(deviceId);
      } else {
        Alert.alert('Error', 'Failed to connect to device');
      }
    } catch (error) {
      Alert.alert('Error', 'Connection failed');
    }
  };

  const handleKeyPress = async (note: number) => {
    setPressedKeys(prev => new Set(prev).add(note));
    try {
      await midiKeyboard.playNote(note, velocity);
    } catch (error) {
      console.error('Error playing note:', error);
    }
  };

  const handleKeyRelease = async (note: number) => {
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
    try {
      await midiKeyboard.releaseNote(note, velocity);
    } catch (error) {
      console.error('Error releasing note:', error);
    }
  };

  const renderOctave = (octaveNumber: number) => {
    const whiteNotes = [0, 2, 4, 5, 7, 9, 11]; // C, D, E, F, G, A, B
    const blackNotes = [1, 3, 6, 8, 10]; // C#, D#, F#, G#, A#
    const baseNote = octaveNumber * 12 + 12;

    return (
      <View style={styles.octaveContainer} key={octaveNumber}>
        <View style={styles.whiteKeysRow}>
          {whiteNotes.map(offset => {
            const note = baseNote + offset;
            return (
              <KeyboardKey
                key={note}
                note={note}
                onPress={handleKeyPress}
                onRelease={handleKeyRelease}
                isPressed={pressedKeys.has(note)}
              />
            );
          })}
        </View>
        <View style={styles.blackKeysRow}>
          {blackNotes.map((offset, index) => {
            const note = baseNote + offset;
            const position = index < 2 ? index : index + 1;
            return (
              <View
                key={note}
                style={[
                  styles.blackKeyContainer,
                  { left: 35 + position * 50 },
                ]}
              >
                <KeyboardKey
                  note={note}
                  isBlack
                  onPress={handleKeyPress}
                  onRelease={handleKeyRelease}
                  isPressed={pressedKeys.has(note)}
                />
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MIDI Keyboard</Text>
        <Text style={styles.status}>
          {connected ? `Connected to ${selectedDevice}` : 'Not connected'}
        </Text>
      </View>

      {!connected && (
        <ScrollView style={styles.deviceList}>
          <Text style={styles.sectionTitle}>Available Devices:</Text>
          {devices.length === 0 ? (
            <Text style={styles.noDevices}>No MIDI devices found</Text>
          ) : (
            devices.map(device => (
              <TouchableOpacity
                key={device.id}
                style={styles.deviceItem}
                onPress={() => connectToDevice(device.id)}
              >
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.deviceId}>ID: {device.id}</Text>
              </TouchableOpacity>
            ))
          )}
          <TouchableOpacity style={styles.refreshButton} onPress={loadDevices}>
            <Text style={styles.refreshButtonText}>Refresh Devices</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {connected && (
        <>
          <View style={styles.controls}>
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Velocity: {velocity}</Text>
              <View style={styles.velocityButtons}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => setVelocity(Math.max(1, velocity - 10))}
                >
                  <Text>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => setVelocity(Math.min(127, velocity + 10))}
                >
                  <Text>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.disconnectButton}
              onPress={() => midiKeyboard.disconnect()}
            >
              <Text style={styles.disconnectButtonText}>Disconnect</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal style={styles.keyboard}>
            <View style={styles.keyboardContent}>
              {[3, 4, 5].map(octaveNum => renderOctave(octaveNum))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.panicButton}
              onPress={() => midiKeyboard.panic()}
            >
              <Text style={styles.panicButtonText}>PANIC</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    padding: 20,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  status: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
  },
  deviceList: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noDevices: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  deviceItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  refreshButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  controls: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  controlLabel: {
    fontSize: 16,
  },
  velocityButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  controlButton: {
    backgroundColor: '#eee',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  disconnectButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  disconnectButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  keyboard: {
    flex: 1,
  },
  keyboardContent: {
    flexDirection: 'row',
    paddingVertical: 20,
  },
  octaveContainer: {
    position: 'relative',
    width: 350,
    height: 200,
  },
  whiteKeysRow: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
  },
  blackKeysRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  key: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
  },
  whiteKey: {
    width: 48,
    height: 180,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 1,
  },
  blackKey: {
    width: 36,
    height: 120,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#000',
  },
  blackKeyContainer: {
    position: 'absolute',
  },
  whiteKeyPressed: {
    backgroundColor: '#ddd',
  },
  blackKeyPressed: {
    backgroundColor: '#555',
  },
  keyText: {
    fontSize: 10,
    color: '#666',
  },
  blackKeyText: {
    color: 'white',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  panicButton: {
    backgroundColor: '#ff0000',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
  },
  panicButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 