jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({})),
  Link: 'Link',
  Stack: {
    Screen: 'Screen',
  },
  Tabs: {
    Screen: 'Screen',
  },
}));

jest.mock('expo-image', () => {
  const React = require('react');
  return {
    Image: (props) => React.createElement('View', { testID: 'expo-image', ...props }),
  };
});

jest.mock('expo-blur', () => ({
  BlurView: 'BlurView',
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 44, bottom: 34, left: 0, right: 0 };
  const React = require('react');
  return {
    useSafeAreaInsets: () => inset,
    SafeAreaProvider: ({ children }) => React.createElement(React.Fragment, null, children),
    SafeAreaView: ({ children }) => React.createElement(React.Fragment, null, children),
  };
});

jest.mock('lucide-react-native', () => {
  const React = require('react');
  const createIcon = (name) => {
    const Icon = (props) => React.createElement('View', { testID: `icon-${name}`, ...props });
    Icon.displayName = name;
    return Icon;
  };
  return new Proxy({}, {
    get: (_, prop) => {
      if (prop === '__esModule') return true;
      return createIcon(String(prop));
    },
  });
});

jest.mock('@rork-ai/toolkit-sdk', () => ({
  useRorkAgent: jest.fn(() => ({
    messages: [],
    sendMessage: jest.fn(),
    setMessages: jest.fn(),
    error: null,
  })),
  createRorkTool: jest.fn((config) => config),
}));

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  return {
    GestureHandlerRootView: ({ children }) => React.createElement(React.Fragment, null, children),
  };
});
