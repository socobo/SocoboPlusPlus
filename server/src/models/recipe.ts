import { SocoboUser } from './socobouser'

export class Recipe {

    public id: number;
    public description: string;
    public imageUrl: string;
    private created: number;

    constructor(
        public title: string,
        public userId: number){
    }
}