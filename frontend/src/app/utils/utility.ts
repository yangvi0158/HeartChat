export const isFileOverSize = (file: File) => {
    if (!file) return false
    const fileSize = file.size
    const fileMb = fileSize / 1024 ** 2
    if (fileMb > 2) return true
    return false
}

export function isInvalidFileName(file: File) {
    return file.name.includes(' ')
}
