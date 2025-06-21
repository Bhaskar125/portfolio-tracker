import React from 'react';
import { Text, View } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
  focused?: boolean;
}

// Dashboard Icon - Modern Analytics
export const DashboardIcon: React.FC<IconProps> = ({ size = 28, color = '#6B7280', focused = false }) => (
  <View style={{ 
    width: size, 
    height: size, 
    justifyContent: 'center', 
    alignItems: 'center',
    opacity: focused ? 1 : 0.7 
  }}>
    <View style={{
      width: size * 0.85,
      height: size * 0.85,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: color,
      backgroundColor: focused ? `${color}20` : 'transparent',
      position: 'relative',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingBottom: 4,
      flexDirection: 'row',
      paddingHorizontal: 3,
    }}>
      {/* Chart Bars */}
      <View style={{ width: 3, height: 8, backgroundColor: color, marginHorizontal: 1, borderRadius: 1 }} />
      <View style={{ width: 3, height: 12, backgroundColor: color, marginHorizontal: 1, borderRadius: 1 }} />
      <View style={{ width: 3, height: 16, backgroundColor: color, marginHorizontal: 1, borderRadius: 1 }} />
      <View style={{ width: 3, height: 20, backgroundColor: color, marginHorizontal: 1, borderRadius: 1 }} />
      
      {/* Trending indicator */}
      <View style={{
        position: 'absolute',
        top: 3,
        right: 3,
        width: 8,
        height: 8,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderColor: color,
        transform: [{ rotate: '45deg' }]
      }} />
    </View>
  </View>
);

// Transactions Icon - Document with Lines
export const TransactionsIcon: React.FC<IconProps> = ({ size = 28, color = '#6B7280', focused = false }) => (
  <View style={{ 
    width: size, 
    height: size, 
    justifyContent: 'center', 
    alignItems: 'center',
    opacity: focused ? 1 : 0.7 
  }}>
    <View style={{
      width: size * 0.8,
      height: size * 0.9,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: color,
      backgroundColor: focused ? `${color}15` : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    }}>
      {/* Document fold */}
      <View style={{
        position: 'absolute',
        top: -2,
        right: -2,
        width: 8,
        height: 8,
        borderWidth: 2,
        borderColor: color,
        borderBottomLeftRadius: 4,
        backgroundColor: 'white',
      }} />
      
      {/* Transaction lines */}
      <View style={{ width: '70%', height: 2, backgroundColor: color, marginVertical: 2, borderRadius: 1 }} />
      <View style={{ width: '70%', height: 2, backgroundColor: color, marginVertical: 2, borderRadius: 1 }} />
      <View style={{ width: '50%', height: 2, backgroundColor: color, marginVertical: 2, borderRadius: 1 }} />
      
      {/* Currency symbol */}
      <View style={{
        position: 'absolute',
        bottom: 4,
        left: 6,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: color,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{ color: 'white', fontSize: 6, fontWeight: 'bold' }}>₹</Text>
      </View>
    </View>
  </View>
);

// Add Icon - Plus with Money Accent
export const AddIcon: React.FC<IconProps> = ({ size = 28, color = '#6B7280', focused = false }) => (
  <View style={{ 
    width: size, 
    height: size, 
    justifyContent: 'center', 
    alignItems: 'center',
    opacity: focused ? 1 : 0.7 
  }}>
    <View style={{
      width: size * 0.85,
      height: size * 0.85,
      borderRadius: (size * 0.85) / 2,
      borderWidth: 2,
      borderColor: color,
      backgroundColor: focused ? `${color}15` : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    }}>
      {/* Plus symbol */}
      <View style={{
        width: size * 0.4,
        height: 3,
        backgroundColor: color,
        borderRadius: 1.5,
      }} />
      <View style={{
        width: 3,
        height: size * 0.4,
        backgroundColor: color,
        borderRadius: 1.5,
        position: 'absolute',
      }} />
      
      {/* Money accent */}
      <View style={{
        position: 'absolute',
        top: -2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: color,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{ color: 'white', fontSize: 8, fontWeight: 'bold' }}>₹</Text>
      </View>
    </View>
  </View>
);

// AI Chat Icon - Smart Chat Bubble
export const AIChatIcon: React.FC<IconProps> = ({ size = 28, color = '#6B7280', focused = false }) => (
  <View style={{ 
    width: size, 
    height: size, 
    justifyContent: 'center', 
    alignItems: 'center',
    opacity: focused ? 1 : 0.7 
  }}>
    <View style={{
      width: size * 0.8,
      height: size * 0.65,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: color,
      backgroundColor: focused ? `${color}20` : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    }}>
      {/* Chat tail */}
      <View style={{
        position: 'absolute',
        bottom: -6,
        left: 8,
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: color,
      }} />
      
      {/* AI Brain dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '60%', marginBottom: 3 }}>
        <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
        <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
      </View>
      
      {/* AI indicator dot */}
      <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: color }} />
      
      {/* AI badge */}
      <View style={{
        position: 'absolute',
        top: -4,
        right: -4,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: color,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{ color: 'white', fontSize: 6, fontWeight: 'bold' }}>AI</Text>
      </View>
    </View>
  </View>
);

// Explore Icon - Compass Design
export const ExploreIcon: React.FC<IconProps> = ({ size = 28, color = '#6B7280', focused = false }) => (
  <View style={{ 
    width: size, 
    height: size, 
    justifyContent: 'center', 
    alignItems: 'center',
    opacity: focused ? 1 : 0.7 
  }}>
    <View style={{
      width: size * 0.85,
      height: size * 0.85,
      borderRadius: (size * 0.85) / 2,
      borderWidth: 2,
      borderColor: color,
      backgroundColor: focused ? `${color}15` : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    }}>
      {/* Compass needle - North */}
      <View style={{
        position: 'absolute',
        top: 3,
        left: '50%',
        marginLeft: -2,
        width: 0,
        height: 0,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderBottomWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: color,
      }} />
      
      {/* Compass needle - South */}
      <View style={{
        position: 'absolute',
        bottom: 3,
        left: '50%',
        marginLeft: -2,
        width: 0,
        height: 0,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: color,
        opacity: 0.6,
      }} />
      
      {/* Center dot */}
      <View style={{
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: color,
      }} />
      
      {/* Direction markers */}
      <View style={{ position: 'absolute', top: 1, width: 2, height: 2, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ position: 'absolute', bottom: 1, width: 2, height: 2, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ position: 'absolute', left: 1, width: 2, height: 2, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ position: 'absolute', right: 1, width: 2, height: 2, backgroundColor: color, borderRadius: 1 }} />
    </View>
  </View>
); 