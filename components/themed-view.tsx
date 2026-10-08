import { View, type ViewProps } from 'react-native';
import { useAppContext } from '@/context/AppContext';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  let isDark = false;
  try {
    const ctx = useAppContext();
    isDark = !!ctx?.isDark;
  } catch {
    isDark = false;
  }

  const backgroundColor = isDark
    ? darkColor || '#0f172a'
    : lightColor || '#f4f8ff';

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
