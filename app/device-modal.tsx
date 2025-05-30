import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useMidi } from "../contexts/MidiContext";

export default function DeviceModal() {
  const {
    devices,
    connectedDevice,
    connectToDevice,
    disconnect,
    refreshDevices,
  } = useMidi();

  const handleRefresh = useCallback(() => {
    refreshDevices();
  }, [refreshDevices]);

  useEffect(() => {
    if (!connectedDevice && devices.length === 1) {
      connectToDevice(devices[0].id);
    }
  }, [connectedDevice, devices, connectToDevice]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {connectedDevice && (
          <View style={styles.connectedSection}>
            <Text style={styles.sectionTitle}>Connected Device</Text>
            <View style={styles.deviceRow}>
              <Text style={styles.deviceName}>{connectedDevice.name}</Text>
              <Ionicons
                name="checkmark-circle-sharp"
                size={12}
                color="#32D74B"
                style={styles.connectedIcon}
              />
            </View>
            <Pressable
              style={styles.disconnectButton}
              onPress={() => {
                disconnect();
                router.back();
              }}
            >
              <Text style={styles.disconnectButtonText}>Disconnect</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.availableSection}>
          <View style={styles.availableHeader}>
            <Text style={styles.sectionTitle}>
              Available Devices ({devices.length})
            </Text>
            <Pressable style={styles.refreshButton} onPress={handleRefresh}>
              <Ionicons name="refresh" size={20} color="#E89D45" />
            </Pressable>
          </View>

          {devices.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="musical-note" size={40} color="#8A7B6B" />
              <Text style={styles.emptyTitle}>No MIDI devices found</Text>
              <Text style={styles.emptyText}>
                Make sure your MIDI device is connected and try refreshing
              </Text>
            </View>
          ) : (
            devices.map((device) => (
              <Pressable
                key={device.id}
                style={styles.deviceItem}
                onPress={() => {
                  connectToDevice(device.id);
                  router.back();
                }}
              >
                <Text style={styles.deviceName}>{device.name}</Text>
              </Pressable>
            ))
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  content: {
    paddingVertical: 16,
    paddingBottom: 32,
  },
  connectedSection: {
    backgroundColor: "#2A2A2A",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  connectedHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  connectedIcon: {
    marginLeft: 4,
    opacity: 0.9,
  },
  availableSection: {
    paddingHorizontal: 16,
  },
  availableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#F5F1E8",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  deviceName: {
    color: "#F5F1E8",
    fontSize: 16,
    opacity: 0.9,
    letterSpacing: -0.2,
  },
  disconnectButton: {
    backgroundColor: "transparent",
    paddingVertical: 8,
    paddingHorizontal: 0,
    alignSelf: "flex-start",
    marginTop: 12,
  },
  disconnectButtonText: {
    color: "#FF453A",
    fontSize: 17,
    fontWeight: "400",
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
  },
  deviceItem: {
    backgroundColor: "#2A2A2A",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyTitle: {
    color: "#F5F1E8",
    fontSize: 17,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: "#8A7B6B",
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
