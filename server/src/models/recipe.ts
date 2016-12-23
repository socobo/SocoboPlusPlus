import { SocoboUser } from './socobouser'

export class Recipe {

    public description: string;
    public imageUrl: string;
    private created: number;

    constructor(
        public title: string,
        public userId: number){
    }
}