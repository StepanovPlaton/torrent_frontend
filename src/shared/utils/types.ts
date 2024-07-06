type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

export type RequiredFrom<T> = {
  [K in RequiredKeys<T>]-?: T[K];
};
