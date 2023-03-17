import { EntityClassName } from "../types/Entity.type";
import { AbstractEntity } from "./AbstractEntity";
import Entites from './entities/_index';

export class EntityFactory {
    public static id = 0;
    private static _entity: AbstractEntity;
    private static readonly entites = Entites;

    constructor() {}

    public static setStrategy(entityTitle: EntityClassName) {
        this._entity = new EntityFactory.entites[entityTitle];
    }

    public static get entity () {
        return EntityFactory._entity;
    }
}
