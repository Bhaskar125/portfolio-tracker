import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function TransactionsScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Transactions</ThemedText>
      </View>
      <ScrollView style={styles.content}>
        <ThemedText>Transaction list will be implemented here</ThemedText>
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