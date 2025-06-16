import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function AddTransactionScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Add Transaction</ThemedText>
      </View>
      <ScrollView style={styles.content}>
        <ThemedText>Add transaction form will be implemented here</ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  content: {
    flex: 1,
    padding: 20,
  },
}); 