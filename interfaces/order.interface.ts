interface Worker{
    name: string,
    img: string,
    rating: number
}
interface Packages{
    id: string,
    packageName: string,
    car: string,
    addsOn: [],
    total: number

}
interface Order{
    uid: string,
    type: string,
    packages: [Packages],
    address:{
        latitude: number,
        longitude: number
    }
    time: {
        date: string,
        hour: string
    }
    total: number,
    status: 'pending' | 'accepted' | 'finished' | 'canceled',
    worker: Worker

}

export { Order, Packages }