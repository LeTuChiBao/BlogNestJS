import { Role } from '@src/role/entites/role.entity';
import { Post } from 'src/post/entities/post.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({nullable:true,default: null})
  refresh_token: string;

  @Column({nullable:true,default: null})
  avatar: string;

  @Column({default : 1})
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(()=> Post, (post)=> post.user)
  posts: Post[]

  @ManyToOne(()=> Role, (role)=>role.users)
  role: Role

}
