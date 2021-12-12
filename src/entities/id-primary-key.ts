import { BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
export class IdPrimaryKey extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
}