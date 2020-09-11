import color from 'color';
import * as React from 'react';
import { I18nManager, StyleProp, TextStyle } from 'react-native';

import { withTheme } from '../../core/theming';
import Text from './Text';

type Props = React.ComponentProps<typeof Text> & {
  alpha: number;
  family: 'regular' | 'medium' | 'light' | 'thin';
  style?: StyleProp<TextStyle>;
  theme: ReactNativePaper.Theme;
};

const StyledText = ({ theme, alpha, family, style, ...rest }: Props) => {
  const textColor = color(theme.colors.text).alpha(alpha).rgb().string();
  const font = theme.fonts[family];
  const writingDirection = I18nManager.isRTL ? 'rtl' : 'ltr';

  return (
    <Text
      {...rest}
      style={[
        { color: textColor, ...font, textAlign: 'left', writingDirection },
        style,
      ]}
    />
  );
};

export default withTheme(StyledText);
