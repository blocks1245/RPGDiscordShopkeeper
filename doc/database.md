```sql
// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

Table items {
  id int [primary key, increment]
  name text
  category text [not null]
  description text
  price int
  dminfo text
  imageurl text
  homebrew int [not null]
}

Table shop {
  itemid int [ref: > items.id]
}

Table inventory {
  playerid int [ref: > players.id]
  itemid int [ref: > items.id]
}

Table players {
  id int [primary key, increment]
  name text [not null]
  description text
  coppercoin int [default: 0]
  image blob
}

Table quests {
  id int [primary key]
  title text [not null]
  description text [not null]
}

Table questPlayers {
  questid int [ref: > quests.id]
  playerid int [ref: > players.id]
}
```

![database](./recources/database.jpg)
