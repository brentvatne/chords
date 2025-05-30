import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMidi } from '../contexts/MidiContext';

export default function DeviceModal() {
  const { devices, connectedDevice, connectToDevice, disconnect, refreshDevices } = useMidi();

  const handleConnect = async (deviceId: string) => {
    try {
      const success = await connectToDevice(deviceId);
      if (!success) {
        Alert.alert("Connection Failed", "Failed to connect to the device");
      } else {
        // Automatically close modal after successful connection
        router.back();
      }
    } catch {
      Alert.alert("Connection Failed", "Failed to connect to the device");
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch {
      Alert.alert("Disconnect Failed", "Failed to disconnect from device");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {connectedDevice && (
          <View style={styles.connectedDeviceContainer}>
            <Text style={styles.connectedDeviceTitle}>
              Connected Device
            </Text>
            <Text style={styles.connectedDeviceName}>
              {connectedDevice.name}
            </Text>
            <Pressable style={styles.disconnectButton} onPress={handleDisconnect}>
              <Text style={styles.disconnectButtonText}>Disconnect</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            Available Devices ({devices.length})
          </Text>
          <Pressable 
            onPress={refreshDevices} 
            style={styles.refreshButton}
          >
            <Ionicons name="refresh" size={20} color="#E89D45" />
          </Pressable>
        </View>

        {devices.length > 0 ? (
          <View>
            {devices.map((device) => {
              const isConnected = connectedDevice?.id === device.id;
              return (
                <View 
                  key={device.id} 
                  style={[
                    styles.deviceCard,
                    isConnected && styles.deviceCardConnected
                  ]}
                >
                  <View style={styles.deviceCardContent}>
                    <View style={styles.deviceInfo}>
                      <Text style={[
                        styles.deviceName,
                        isConnected && styles.deviceNameConnected
                      ]}>
                        {device.name}
                      </Text>
                      <Text style={styles.deviceId}>
                        ID: {device.id}
                      </Text>
                      {isConnected && (
                        <Text style={styles.connectedStatus}>
                          ✓ Connected
                        </Text>
                      )}
                    </View>
                    
                    {!isConnected && (
                      <Pressable 
                        style={styles.connectButton}
                        onPress={() => handleConnect(device.id)}
                      >
                        <Text style={styles.connectButtonText}>Connect</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.noDevicesContainer}>
            <Ionicons name="musical-note" size={64} color="#8A7B6B" style={styles.noDevicesIcon} />
            <Text style={styles.noDevicesText}>
              No MIDI devices found
            </Text>
            <Text style={styles.noDevicesSubtext}>
              Make sure your MIDI device is connected and try refreshing
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8', // Cream/beige like keyboard body
  },
  content: {
    flex: 1,
    padding: 20,
  },
  connectedDeviceContainer: {
    backgroundColor: '#E8F5E8', // Light green for connected state
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  connectedDeviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2E7D32',
  },
  connectedDeviceName: {
    fontSize: 14,
    marginBottom: 10,
    color: '#388E3C',
  },
  disconnectButton: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  disconnectButtonText: {
    color: '#F5F1E8',
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#2A2A2A',
  },
  refreshButton: {
    padding: 8,
    backgroundColor: "#1C1C1E", // Black like control panel
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  deviceCard: {
    padding: 15,
    borderWidth: 2,
    borderColor: '#D4C4A8', // Warm beige
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#FEFCF8', // Slightly warmer white
  },
  deviceCardConnected: {
    borderColor: '#4CAF50',
    backgroundColor: '#F0F8F0',
  },
  deviceCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'normal',
    marginBottom: 4,
    color: '#2A2A2A',
  },
  deviceNameConnected: {
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  deviceId: {
    fontSize: 12,
    color: '#8A7B6B', // Muted brown
  },
  connectedStatus: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
    fontWeight: '600',
  },
  connectButton: {
    backgroundColor: '#E89D45', // Warm orange
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  connectButtonText: {
    color: '#F5F1E8', // Cream text
    fontWeight: 'bold',
  },
  noDevicesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  noDevicesIcon: {
    marginBottom: 20,
  },
  noDevicesText: {
    fontSize: 16,
    color: '#6B5B47', // Warm brown
    textAlign: 'center',
    marginBottom: 8,
  },
  noDevicesSubtext: {
    fontSize: 14,
    color: '#8A7B6B', // Muted brown
    textAlign: 'center',
  },
}); 