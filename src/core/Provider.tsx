import * as React from 'react';
import { AccessibilityInfo, Appearance, ColorSchemeName } from 'react-native';
import MaterialCommunityIcon from '../components/MaterialCommunityIcon';
import PortalHost from '../components/Portal/PortalHost';
import DefaultTheme from '../styles/DefaultTheme';
import DarkTheme from '../styles/DarkTheme';
import { Provider as SettingsProvider, Settings } from './settings';
import { ThemeProvider } from './theming';

type Props = {
  children: React.ReactNode;
  theme?: ReactNativePaper.Theme;
  settings?: Settings;
};

const Provider = ({ ...props }: Props) => {
  const colorSchemeName =
    (!props.theme && Appearance?.getColorScheme()) || 'light';

  const [reduceMotionEnabled, setReduceMotionEnabled] = React.useState<boolean>(
    false
  );
  const [colorScheme, setColorScheme] = React.useState<ColorSchemeName>(
    colorSchemeName
  );

  const handleAppearanceChange = (
    preferences: Appearance.AppearancePreferences
  ) => {
    const { colorScheme } = preferences;
    setColorScheme(colorScheme);
  };

  React.useEffect(() => {
    if (!props.theme) {
      AccessibilityInfo.addEventListener(
        'reduceMotionChanged',
        setReduceMotionEnabled
      );
    }
    return () => {
      if (!props.theme) {
        AccessibilityInfo.removeEventListener(
          'reduceMotionChanged',
          setReduceMotionEnabled
        );
      }
    };
  }, [props.theme]);

  React.useEffect(() => {
    if (!props.theme) Appearance?.addChangeListener(handleAppearanceChange);
    return () => {
      if (!props.theme)
        Appearance?.removeChangeListener(handleAppearanceChange);
    };
  }, [props.theme]);

  const getTheme = () => {
    const { theme: providedTheme } = props;

    if (providedTheme) {
      return providedTheme;
    } else {
      const theme = (colorScheme === 'dark'
        ? DarkTheme
        : DefaultTheme) as ReactNativePaper.Theme;

      return {
        ...theme,
        animation: {
          ...theme.animation,
          scale: reduceMotionEnabled ? 0 : 1,
        },
      };
    }
  };

  const { children, settings } = props;
  return (
    <PortalHost>
      <SettingsProvider value={settings || { icon: MaterialCommunityIcon }}>
        <ThemeProvider theme={getTheme()}>{children}</ThemeProvider>
      </SettingsProvider>
    </PortalHost>
  );
};

export default Provider;
