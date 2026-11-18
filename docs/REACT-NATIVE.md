# React Native

Mobile apps share DX **tokens**, not components. One file, `tokens.native.ts`, holds every token with aliases resolved: colors as hex strings, sizes as numbers (dp). It has no dependencies, so it works in Expo, bare React Native and plain TypeScript.

## Get the file

Copy [dist/tokens.native.ts](../dist/tokens.native.ts) into your app (for example `src/theme/tokens.native.ts`), or install the repo at a version tag:

```bash
npm i github:DX-Gamores/dx-design-system#v4.0.0
```

```ts
import { createTheme } from "@dxform/design-system/tokens.native";
```

## Use it

```tsx
import { useColorScheme, View, Text, Pressable } from "react-native";
import { createTheme } from "./theme/tokens.native";

export function useDXTheme() {
  const scheme = useColorScheme();
  return createTheme({ brand: "default", mode: scheme === "dark" ? "dark" : "light", density: "comfortable" });
}

export function SaveButton() {
  const t = useDXTheme();
  return (
    <Pressable
      style={{
        backgroundColor: t.component.button.primary.bg,
        height: t.size.controlMd,
        paddingHorizontal: t.padding.controlMd,
        borderRadius: t.radius.control,
        justifyContent: "center",
      }}
    >
      <Text style={[t.typography.label.medium, { color: t.component.button.primary.fg }]}>Save</Text>
    </Pressable>
  );
}
```

## What's in the theme

`createTheme({ brand, mode, density, size, reducedMotion })` returns:

| Key | Contents | Example |
| --- | --- | --- |
| `colors` | Semantic colors (Color collection) | `t.colors.bg.surface`, `t.colors.text.secondary`, `t.colors.border.focus`, `t.colors.dataviz.series1` |
| `palette` | Brand ramps 50–950 and roles | `t.palette.primary[600]`, `t.palette.role.solid` |
| `fonts` | Font family names for the brand | `t.fonts.heading` → `"Inter"` |
| `spacing` | 4px scale | `t.spacing[4]` → 16, `t.spacing["0.5"]` → 2 |
| `radius` | Scale plus brand shape | `t.radius.md`, `t.radius.control`, `t.radius.container` |
| `size`, `padding`, `gap`, `borderWidth` | Density-aware sizes | `t.size.controlMd` → 40 (32 compact) |
| `typography` | Text styles, phone or tablet sizes | `t.typography.heading.h1`, `t.typography.body.medium` |
| `elevation` | Shadows for the mode | `t.elevation[2].boxShadow` (RN 0.76+), or `shadowColor`, `shadowOpacity`, `shadowOffset`, `shadowRadius`, `elevation` |
| `component` | Button, Field and Card tokens | `t.component.button.secondary.border` |
| `motion` | Durations (ms), easings, springs | `Easing.bezier(...t.motion.easing.standard)`, `withSpring(v, t.motion.spring.snappy)` |
| `opacity`, `zIndex`, `layout` | Effects and grid | `t.opacity.disabled` → 0.4, `t.layout.margin` |

Options:

| Option | Values | Default |
| --- | --- | --- |
| `brand` | `default` · `violet` · `amber` | `default` |
| `mode` | `light` · `dark` · `light-hc` · `dark-hc` | `light` |
| `density` | `comfortable` · `compact` | `comfortable` |
| `size` | `mobile` · `tablet` (text sizes and layout grid) | `mobile` |
| `reducedMotion` | `true` sets durations to 0 (read `AccessibilityInfo.isReduceMotionEnabled()`) | `false` |

## Fonts

`t.fonts` gives family names. Load the files once at startup, for example with Expo:

```bash
npx expo install expo-font @expo-google-fonts/inter @expo-google-fonts/roboto-mono
```

With `@expo-google-fonts`, each weight has its own family name (`Inter_600SemiBold`). Map `fontWeight` to the family you loaded, or register the files under the plain names in `t.fonts` with `expo-font`'s `useFonts({ Inter: require(...) })`.

## Keeping in sync

`tokens.native.ts` is generated from the Figma export by `npm run tokens` and checked in CI, so it always matches `tokens.css`. A test checks that every semantic color matches the web tokens in all 12 brand × mode combinations.
