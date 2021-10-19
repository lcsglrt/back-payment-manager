create database payment_manager;

drop table if exists users;

create table if not exists users (
    id serial primary key,
    name text not null,
    email text not null unique,
    password text not null,
    phone text,
    cpf text unique
);

drop table if exists clients;

create table if not exists clients (
    id serial primary key,
    user_id integer not null,
    name text not null,
    email text not null unique,
    cpf text not null unique,
    phone text not null,
    street text,
    additional text,
    district text,
    city text,
    state text,
    zipcode text,
    landmark text,
    foreign key (user_id) references users (id)
);

drop table if exists charges;

create table if not exists charges (
  id serial primary key,
  create_at timestamptz not null default current_timestamp,
  user_id integer not null,
  client_id integer not null,
  description text not null,
  status boolean default false not null,
  amount integer not null,
  due_date bigint not null,
  foreign key (user_id) references users (id),
  foreign key (client_id) references clients (id)
);