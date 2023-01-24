export class Token{
    constructor(
        private token:string,
        private drive:string
    ){}

    getToken(){
        return this.token
    }

    getTokenDrive(){
        return this.drive
    }
}
