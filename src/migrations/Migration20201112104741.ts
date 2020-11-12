import { Migration } from '@mikro-orm/migrations';

export class Migration20201112104741 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `user` (`id` int unsigned not null auto_increment primary key, `email` varchar(255) not null, `username` varchar(255) not null, `password` varchar(255) not null, `name` varchar(255) not null, `mobile_number` varchar(255) not null, `super_user` tinyint(1) not null, `created_at` datetime not null, `update_at` datetime not null, `deleted_at` datetime null) default character set utf8mb4 engine = InnoDB;');
  }

}
