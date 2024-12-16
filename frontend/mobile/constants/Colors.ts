/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
const tintColorLight = 'hsl(221.2, 83.2%, 53.3%)';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: 'hsl(0, 0%, 100%)',
    foreground: 'hsl(222.2, 84%, 4.9%)',
    card: 'hsl(0, 0%, 100%)',
    cardForeground: 'hsl(222.2, 84%, 4.9%)',
    popover: 'hsl(0, 0%, 100%)',
    popoverForeground: 'hsl(222.2, 84%, 4.9%)',
    primary: 'hsl(221.2, 83.2%, 53.3%)',
    primaryForeground: 'hsl(210, 40%, 98%)',
    secondary: 'hsl(210, 40%, 96.1%)',
    secondaryForeground: 'hsl(222.2, 47.4%, 11.2%)',
    muted: 'hsl(210, 40%, 96.1%)',
    mutedForeground: 'hsl(215.4, 16.3%, 46.9%)',
    accent: 'hsl(210, 40%, 96.1%)',
    accentForeground: 'hsl(222.2, 47.4%, 11.2%)',
    destructive: 'hsl(0, 84.2%, 60.2%)',
    destructiveForeground: 'hsl(210, 40%, 98%)',
    border: 'hsl(214.3, 31.8%, 91.4%)',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: 'hsl(218, 10%, 97.8%)',
    background: 'hsl(218, 65%, 4.48%)',
    foreground: 'hsl(0, 0%, 100%)',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    card: 'hsl(218, 100%, 7%)',
    cardForeground: 'hsl(218, 10%, 97.8%)',
    popover: 'hsl(218, 45%, 7.28%)',
    popoverForeground: 'hsl(218, 10%, 97.8%)',
    primary: 'hsl(218, 100%, 56%)',
    primaryForeground: 'hsl(218, 10%, 100%)',
    secondary: 'hsl(218, 50%, 16.8%)',
    secondaryForeground: 'hsl(218, 10%, 97.8%)',
    muted: 'hsl(218, 50%, 16.8%)',
    mutedForeground: 'hsl(218, 10%, 55.6%)',
    accent: 'hsl(218, 50%, 16.8%)',
    accentForeground: 'hsl(218, 10%, 97.8%)',
    destructive: 'hsl(0, 62.8%, 30.6%)',
    destructiveForeground: 'hsl(218, 10%, 97.8%)',
    border: 'hsl(218, 50%, 16.8%)',
    input: 'hsl(218, 50%, 16.8%)',
  }
};
