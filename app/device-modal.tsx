import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback } from "react";
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

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {connectedDevice && (
          <View style={styles.connectedSection}>
            <Text style={styles.sectionTitle}>Connected Device</Text>
            <View
              style={[styles.deviceRow, { justifyContent: "space-between" }]}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="checkmark-circle-sharp"
                  size={16}
                  color="#32D74B"
                  style={styles.connectedIcon}
                />
                <Text style={styles.deviceName}>{connectedDevice.name}</Text>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.disconnectButton,
                  pressed && { opacity: 0.5 },
                ]}
                onPress={() => {
                  disconnect();
                }}
              >
                <Text style={styles.disconnectButtonText}>Disconnect</Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.availableSection}>
          <View style={styles.availableHeader}>
            <Text style={styles.sectionTitle}>
              All Devices ({devices.length})
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
                style={[
                  styles.deviceItem,
                  device.id === connectedDevice?.id && { opacity: 0.5 },
                ]}
                onPress={() => {
                  connectToDevice(device.id);
                  router.back();
                }}
                disabled={device.id === connectedDevice?.id}
              >
                <Text style={styles.deviceName}>
                  {device.name}
                  {device.id === connectedDevice?.id && " (Connected)"}
                </Text>
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
    marginRight: 6,
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
    fontSize: 18,
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
    fontSize: 18,
    opacity: 0.9,
    letterSpacing: -0.2,
  },
  disconnectButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3A3A3A",
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
