import { Migration } from '@mikro-orm/migrations';

export class Migration20201116193156 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `driver_feed` (`id` int unsigned not null auto_increment primary key, `client_id` int(11) unsigned not null, `destination` varchar(255) not null, `pricing` int(11) not null, `departure_date` varchar(255) not null, `created_at` datetime not null, `update_at` datetime not null, `deleted_at` datetime null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `driver_feed` add index `driver_feed_client_id_index`(`client_id`);');

    this.addSql('alter table `driver_feed` add constraint `driver_feed_client_id_foreign` foreign key (`client_id`) references `user` (`id`) on update cascade;');
  }

}
