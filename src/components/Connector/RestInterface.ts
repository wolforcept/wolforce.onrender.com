import axios, { AxiosResponse } from "axios";
import Message from "common/Message";
import Player from "common/Player";

export interface Response {

}

export class RestInterface {

    public roomcode: string = '';
    public player: Player | undefined = undefined;
    private getUrl: string;
    private postUrl: string;

    constructor(path: string, port: string, private gamename: string) {
        this.getUrl = `http://${path}:${port}/api/${gamename}/`
        this.postUrl = `http://${path}:${port}/api/post/`
        // this.url = `/api/post/`
    }

    async get(): Promise<any> {
        try {

            const response: AxiosResponse = await axios.get<object>(
                this.getUrl + this.roomcode,
                {
                    headers: {
                        Accept: 'application/json',
                    },
                },
            );
            console.log(response)
            return (response?.data as Message)?.payload;

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('error message: ', error.message);
            } else {
                console.log('unexpected error: ', error);
            }
        }
        return null;
    }

    async post(data: any): Promise<any> {

        const message: Message = {
            gamename: this.gamename,
            roomcode: this.roomcode,
            sender: this.player?.username ?? '',
            type: 'input',
            payload: data
        }

        return await axios.post(this.postUrl, message);

        // try {

        //     console.log({ postingData: message })
        //     const response: AxiosResponse = await axios.post<object>(
        //         this.url + this.roomcode,
        //         message,
        //         {
        //             headers: {
        //                 Accept: 'application/json',
        //             },
        //         },
        //     );

        //     return response.data;

        // } catch (error) {
        //     if (axios.isAxiosError(error)) {
        //         console.error('Axios Error: ', error.message);
        //     } else {
        //         console.error('unexpected error: ', error);
        //     }
        // }
        // return null;
    }



}