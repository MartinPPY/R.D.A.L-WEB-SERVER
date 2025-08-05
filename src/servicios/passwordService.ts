import bcrypt from 'bcrypt'

const SALTS_ROUNDS: number = 10

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALTS_ROUNDS);
}

export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
}