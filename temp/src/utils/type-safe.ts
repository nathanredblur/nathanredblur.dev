// https://github.com/microsoft/TypeScript/pull/12253#issuecomment-393954723
export const keys = Object.keys as <T>(o: T) => (Extract<keyof T, string>)[];