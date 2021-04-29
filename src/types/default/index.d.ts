
import { IMongoDBUser } from "src/interfaces/user"


declare global {
    namespace Express {
        // tslint:disable-next-line:no-empty-interface
        interface AuthInfo { }
        // tslint:disable-next-line:no-empty-interface
        interface User extends IMongoDBUser { }

        interface Request {
            authInfo?: AuthInfo
            user?: User
            session?: any

            // These declarations are merged into express's Request type
            login(user: User, done: (err: any) => void): void
            login(user: User, options: any, done: (err: any) => void): void
            logIn(user: User, done: (err: any) => void): void
            logIn(user: User, options: any, done: (err: any) => void): void

            logout(): void
            logOut(): void

            isAuthenticated(): this is AuthenticatedRequest
            isUnauthenticated(): this is UnauthenticatedRequest
        }

        interface AuthenticatedRequest extends Request {
            user: User
        }

        interface UnauthenticatedRequest extends Request {
            user?: undefined
        }
    }
}