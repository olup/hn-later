import type { ReactNode } from "react";
import { Pressable, StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

type Props = {
  children: ReactNode;
  onPress?: () => void;
  active?: boolean;
  danger?: boolean;
  accessibilityLabel: string;
};

export function IconButton({ children, onPress, active, danger, accessibilityLabel }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        active && styles.active,
        danger && styles.danger,
        pressed && styles.pressed,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 8,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  active: {
    backgroundColor: colors.orangeSoft,
  },
  danger: {
    backgroundColor: "rgba(255,90,69,0.1)",
  },
  pressed: {
    opacity: 0.72,
  },
});
