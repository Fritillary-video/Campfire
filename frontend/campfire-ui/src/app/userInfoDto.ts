export interface UserInfoDTO {
    id: string;
    sub: string;
    givenName: string;
    familyName: string;
    name: string;
    picture: string;
    email: string;
    subscribers: Set<string>;
}
