export function getAllowedOrigins(): string[] {
  return process.env.ALLOWED_ORIGINS?.split(',') ?? [];
}

export const getServerPort = (): number => {
  return parseInt(process.env.PORT ?? '3000', 10);
};
