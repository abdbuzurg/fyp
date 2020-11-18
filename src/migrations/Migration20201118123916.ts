import { Migration } from '@mikro-orm/migrations';

export class Migration20201118123916 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `user` (`id` int unsigned not null auto_increment primary key, `email` varchar(255) not null, `username` varchar(255) not null, `password` varchar(255) not null, `name` varchar(255) not null, `mobile_number` varchar(255) not null, `super_user` tinyint(1) not null, `created_at` datetime not null, `update_at` datetime not null, `deleted_at` datetime null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `driver_feed` (`id` int unsigned not null auto_increment primary key, `destination` varchar(255) not null, `pricing` int(11) not null, `departure_date` varchar(255) not null, `client_id` int(11) unsigned not null, `created_at` datetime not null, `update_at` datetime not null, `deleted_at` datetime null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `driver_feed` add index `driver_feed_client_id_index`(`client_id`);');

    this.addSql('create table `client_feed` (`id` int unsigned not null auto_increment primary key, `driver_id` int(11) unsigned not null, `destination` varchar(255) not null, `pricing` int(11) not null, `car_model` varchar(255) not null, `number_of_seats` int(11) not null, `arrival_time` varchar(255) not null, `departure_date` varchar(255) not null, `created_at` datetime not null, `update_at` datetime not null, `deleted_at` datetime null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `client_feed` add index `client_feed_driver_id_index`(`driver_id`);');

    this.addSql('create table `request` (`id` int unsigned not null auto_increment primary key, `sender_id` int(11) unsigned not null, `reciever_id` int(11) unsigned not null, `feed_type` int(11) not null, `request_status` int(11) not null, `response_status` int(11) not null, `created_at` datetime not null, `update_at` datetime not null, `deleted_at` datetime null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `request` add index `request_sender_id_index`(`sender_id`);');
    this.addSql('alter table `request` add index `request_reciever_id_index`(`reciever_id`);');

    this.addSql('create table `driver_feed_request` (`driver_feed_id` int(11) unsigned not null, `request_id` int(11) unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `driver_feed_request` add index `driver_feed_request_driver_feed_id_index`(`driver_feed_id`);');
    this.addSql('alter table `driver_feed_request` add index `driver_feed_request_request_id_index`(`request_id`);');
    this.addSql('alter table `driver_feed_request` add primary key `driver_feed_request_pkey`(`driver_feed_id`, `request_id`);');

    this.addSql('create table `client_feed_request` (`client_feed_id` int(11) unsigned not null, `request_id` int(11) unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `client_feed_request` add index `client_feed_request_client_feed_id_index`(`client_feed_id`);');
    this.addSql('alter table `client_feed_request` add index `client_feed_request_request_id_index`(`request_id`);');
    this.addSql('alter table `client_feed_request` add primary key `client_feed_request_pkey`(`client_feed_id`, `request_id`);');

    this.addSql('alter table `driver_feed` add constraint `driver_feed_client_id_foreign` foreign key (`client_id`) references `user` (`id`) on update cascade;');

    this.addSql('alter table `client_feed` add constraint `client_feed_driver_id_foreign` foreign key (`driver_id`) references `user` (`id`) on update cascade;');

    this.addSql('alter table `request` add constraint `request_sender_id_foreign` foreign key (`sender_id`) references `user` (`id`) on update cascade;');
    this.addSql('alter table `request` add constraint `request_reciever_id_foreign` foreign key (`reciever_id`) references `user` (`id`) on update cascade;');

    this.addSql('alter table `driver_feed_request` add constraint `driver_feed_request_driver_feed_id_foreign` foreign key (`driver_feed_id`) references `driver_feed` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `driver_feed_request` add constraint `driver_feed_request_request_id_foreign` foreign key (`request_id`) references `request` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `client_feed_request` add constraint `client_feed_request_client_feed_id_foreign` foreign key (`client_feed_id`) references `client_feed` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `client_feed_request` add constraint `client_feed_request_request_id_foreign` foreign key (`request_id`) references `request` (`id`) on update cascade on delete cascade;');
  }

}
