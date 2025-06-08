create database if not exists flexpath_final;
use flexpath_final;

drop table if exists users, roles;

create table users (
    username varchar(255) primary key,
    password varchar(255)
);



insert into users (username, password) values ('admin', '$2a$10$tBTfzHzjmQVKza3VSa5lsOX6/iL93xPVLlLXYg2FhT6a.jb1o6VDq');


insert into users (username, password) values ('user', '$2a$10$tBTfzHzjmQVKza3VSa5lsOX6/iL93xPVLlLXYg2FhT6a.jb1o6VDq');
