export type Location = {
    id: number
    creatorUid: string
    public: boolean,
    name: string
    address: string
    latitude: number
    longitude: number
}

export type createLocation = {
    name: string
    address: string
    public: boolean,
    latitude: number
    longitude: number
}