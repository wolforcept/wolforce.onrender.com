
class _LocalStorage {

    get<T>(key: string): any {
        return localStorage.getItem(key) as unknown as T
    }

    tryGet<T>(key: string, def: T): T {
        const val = localStorage.getItem(key) as unknown as T
        if (val)
            return val
        return def
    }

    set(key: string, value: any): any {
        return localStorage.setItem(key, value)
    }
}

export const LocalStorage = new _LocalStorage();


// class _RestInterface {

//     constructor(url, port){

//     }

//     async post() {
//         try {
//             // 👇️ const data: GetUsersResponse
//             const { data, status } = await axios.get<GetUsersResponse>(
//                 'https://reqres.in/api/users',
//                 {
//                     headers: {
//                         Accept: 'application/json',
//                     },
//                 },
//             );

//             console.log(JSON.stringify(data, null, 4));

//             // 👇️ "response status is: 200"
//             console.log('response status is: ', status);

//             return data;
//         } catch (error) {
//             if (axios.isAxiosError(error)) {
//                 console.log('error message: ', error.message);
//                 return error.message;
//             } else {
//                 console.log('unexpected error: ', error);
//                 return 'An unexpected error occurred';
//             }
//         }
//     }
// }

// export const RestInterface = new _RestInterface('localhost',3001);


