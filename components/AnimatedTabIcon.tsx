import React, { useEffect } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from "react-native-reanimated";

type Props = {
  focused: boolean;
  children: React.ReactNode;
};

export default function AnimatedTabIcon({ focused, children }: Props) {

  const scale = useSharedValue(1);

  useEffect(() => {

    scale.value = withSequence(
      withSpring(0.85),
      withSpring(focused ? 1.4 : 1)
    );

  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
        },
        animatedStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
}