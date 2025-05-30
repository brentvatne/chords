import { Ionicons } from "@expo/vector-icons";
import { Alert, Button, Pressable, Text, View } from "react-native";
import { useMidi } from '../../contexts/MidiContext';

export default function DeviceScreen() {
  const { devices, connectedDevice, connectToDevice, disconnect, refreshDevices } = useMidi();

  const handleConnect = async (deviceId: string) => {
    try {
      const success = await connectToDevice(deviceId);
      if (!success) {
        Alert.alert("Connection Failed", "Failed to connect to the device");
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
    <View style={{ flex: 1, padding: 20 }}>
      {connectedDevice && (
        <View style={{ 
          backgroundColor: '#e8f5e8', 
          padding: 15, 
          borderRadius: 8, 
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#4CAF50'
        }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            Connected Device
          </Text>
          <Text style={{ fontSize: 14, marginBottom: 10 }}>
            {connectedDevice.name}
          </Text>
          <Button title="Disconnect" onPress={handleDisconnect} color="#ff4444" />
        </View>
      )}

      <View style={{ 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: 20 
      }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          Available Devices ({devices.length})
        </Text>
        <Pressable 
          onPress={refreshDevices} 
          style={{ 
            padding: 8, 
            backgroundColor: "#f0f0f0", 
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Ionicons name="refresh" size={20} color="#007AFF" />
        </Pressable>
      </View>

      {devices.length > 0 ? (
        <View>
          {devices.map((device) => {
            const isConnected = connectedDevice?.id === device.id;
            return (
              <View 
                key={device.id} 
                style={{ 
                  padding: 15, 
                  borderWidth: 1, 
                  borderColor: isConnected ? '#4CAF50' : '#ddd', 
                  borderRadius: 8, 
                  marginBottom: 10,
                  backgroundColor: isConnected ? '#f0f8f0' : '#fff'
                }}
              >
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      fontSize: 16, 
                      fontWeight: isConnected ? 'bold' : 'normal',
                      marginBottom: 4
                    }}>
                      {device.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#666' }}>
                      ID: {device.id}
                    </Text>
                    {isConnected && (
                      <Text style={{ fontSize: 12, color: '#4CAF50', marginTop: 4 }}>
                        ✓ Connected
                      </Text>
                    )}
                  </View>
                  
                  {!isConnected && (
                    <Button 
                      title="Connect" 
                      onPress={() => handleConnect(device.id)}
                      color="#007AFF"
                    />
                  )}
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          paddingBottom: 100
        }}>
          <Ionicons name="musical-note" size={64} color="#ccc" style={{ marginBottom: 20 }} />
          <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
            No MIDI devices found
          </Text>
          <Text style={{ fontSize: 14, color: '#999', textAlign: 'center', marginTop: 8 }}>
            Make sure your MIDI device is connected and try refreshing
          </Text>
        </View>
      )}
    </View>
  );
} 