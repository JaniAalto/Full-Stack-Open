import { Platform } from 'react-native';
import { useFonts } from 'expo-font';

export const loadFonts = () => {
  const [fontsLoaded, error] = useFonts({ 
    'Roboto': require('../assets/fonts/Roboto-Regular.ttf') 
  });
  console.log("fontsLoaded", fontsLoaded)
  error && console.log("loadFonts error", error)

  return fontsLoaded
}

export const theme = {
  colors: {
    textPrimary: '#24292e',
    textSecondary: '#586069',
    primary: '#0366d6',
  },
  fontSizes: {
    body: 14,
    subheading: 16,
  },
  fonts: {
    main: Platform.select({
      android: 'Roboto',
      ios: 'Arial',
      default: 'System'
    })
  },
  fontWeights: {
    normal: '400',
    bold: '700',
  },
};