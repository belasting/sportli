import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface SportliLogoProps {
  size?: number;
}

/**
 * Sportli logo — requires assets/logo.png to be present.
 * Save the Sportli runner icon PNG to: assets/logo.png
 */
export const SportliLogo: React.FC<SportliLogoProps> = ({ size = 36 }) => {
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Image
        source={require('../../assets/logo.png')}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
