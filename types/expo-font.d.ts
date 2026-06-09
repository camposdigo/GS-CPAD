declare module 'expo-font' {
  export function useFonts(
    map: Record<string, number | string>,
  ): [boolean, Error | null];
}
