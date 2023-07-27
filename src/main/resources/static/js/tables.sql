create table users (
                       id bigint auto_increment primary key,
                       firstName varchar(45),
                       lastName varchar(45),
                       email varchar(45),
                       age int(10),
                       password varchar(45)
);

create table roles (
                       id bigint auto_increment primary key,
                       name varchar(45)
);

create table users_roles (
                             user_id int,
                             role_id int,
                             primary key (user_id, role_id),
                             foreign key (user_id) references users(id),
                             foreign key (role_id) references roles(id)
)