export type EntityImport = typeof import('../classes/entities/_index').default;
export type EntityClassName = keyof EntityImport;
