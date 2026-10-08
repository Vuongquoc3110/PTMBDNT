import { Redirect } from 'expo-router';

// Redirect to the orders tab instead
export default function OrdersRedirect() {
  return <Redirect href="/(tabs)/explore" />;
}
