interface GenericResponse {
    success: boolean;
    message: string;
    statusCode: number;
}

export interface IUser {
    address: string;
    bankAccountNo: string;
    bankName: string;
    email: string;
    firstName: string;
    isActive: boolean;
    isEmailConfirmed: boolean;
    lastName: string;
    phoneNo: number
    registerNumber: string;
}

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginBody {
    email: string;
    password: string;
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    registerNumber: string;
    userType: number;
    role: string;
    isActive: boolean;
    companyId: number;
    // company?: Company;
}

export interface LoginResponse extends GenericResponse {
    response: {
        // user: User;
        accessToken: string;
        refreshToken: string
    }
}
export interface LogoutResponse extends GenericResponse {
    statusCode: number;
}
export interface AuthenticationResponse extends GenericResponse {
    response: IUser;
}