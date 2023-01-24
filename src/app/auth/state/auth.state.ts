import { Usuario } from "src/app/models/usuario.model"
import { Token } from "../../models/auth/token.model"

export interface AuthState{
    token: Token | null,
    clientSelectedToken: Token | null,
    user: Usuario,
    loginWaiting: boolean,
    superusers: Usuario[]
}

export const initialStateAuth: AuthState = {
    token: null,
    clientSelectedToken: null,
    user: null,
    loginWaiting: false,
    superusers: null
}
