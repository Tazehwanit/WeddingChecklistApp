import { Person } from './person';

export interface Item {
    id: number,
    checked: boolean,
    title: string,
    location: string,
    description: string,
    people: number[],
    deadline: Date,
}
