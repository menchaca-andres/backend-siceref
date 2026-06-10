export const activeOnly = { deleted_at: null } as const

export const withActiveOnly = <T extends object>(where?: T) => ({
    ...(where ?? {}),
    deleted_at: null,
})

export const softDeleteNow = () => new Date()
