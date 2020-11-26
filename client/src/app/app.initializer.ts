import { AuthService } from './auth.service';
export function appInitializer(auth: AuthService){
    return () => new Promise(resolve => {
        auth.refreshToken().subscribe().add(resolve);
    })
}