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

export type Trips = {
    id: number
    trip_name: string
    date_of_trip: string,
    time_of_trip: string,
    driver: {
        id: string
        username: string
    },
    vehicle: {
        id: number
        seats_available: number
        seats_occupied: number
        registration: string
        make: string
        color: string
    },
    passengers: {
        id: number
        lat: number
        lng: number
        address: string
        pending: boolean
        status: string
        driver: {
            id: string
            username: string
        }
    }[],
    destination: {
        lat: number
        lng: number
        address: string
    },
    origin: {
        lat: number
        lng: number
        address: string
    }
}

export type createTrip = {
    trip_name: string
    vehicle_id: number | null
    Registration: string
    Make: string
    Color: string
    seats_available: number
    date_of_trip: string // E.g "2024-12-20T08:30:00Z" 
    destination_lat: string
    destination_long: string
    destination_address: string
    origin_lat: string
    origin_long: string
    origin_address: string
}

export type updateTrip = {
    id: number
    trip_name: string | null
    vehicle_id: number | null
    Registration: string | null
    Make: string | null
    Color: string | null
    seats_available: number | null
    date_of_trip: string | null // E.g "2024-12-20T08:30:00Z" 
    destination_lat: number | null
    destination_long: number | null
    destination_address: string | null
    origin_lat: number | null
    origin_long: number | null
    origin_address: string | null
}

export type Group = {
    id: string,
    name: string, 
    creator: string,
    users: string[],
    trip_id: string,
    date_of_trip: string,
};

export type Passenger = {
    id: string,
    trip_id: string,
    latitude: string,
    longitude: string,
    address: string,
    user_id: string,
    pending: string,
    status: string
}

export type UpdatePassenger = {
    id: string,
    trip_id: string | null,
    latitude: string | null,
    longitude: string | null,
    address: string | null,
    user_id: string | null,
    pending: string | null,
    status: string | null
}

export type CreatePassenger = {
    trip_id: string,
    latitude: string,
    longitude: string,
    address: string,
    user_uid: string,
}

export type OwnerUpdatePassenger = {
    id: string,
    pending: boolean | null,
    status: string | null
}

export type TripPassengerFormat = {
    id: number
    lat: number
    lng: number
    address: string
    pending: boolean
    status: string
    driver: {
        id: string
        username: string
    }
}

export type User = {
    created_at: string
    firebaseUid: string
    role: string
    updatedAt: string
    username: string
}