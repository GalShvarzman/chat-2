const {TreeController} = require('./controllers/tree-controller');

new TreeController().init();

//
//
//
// const tree = new NTree();
// tree.add(new User("Eyal", 28, 123));
//
// tree.add(new Group(null, "group1"));
// tree.add(new Group(null, "group2"));
// tree.add(new Group(null, "group3"));
// tree.add(new User("Gal", 27, 123));
//
//
// tree.add(new User("Tali", 28, 123));
// var dana = new User("Dana", 28, 123);
//
// tree.add(new Group (null, "group4"), "group3");
// tree.add(new Group (null, "group5"), "group2");
// tree.add(dana, "group2");
// tree.add(new User("Tali", 28, 123), "group2");
// tree.add(new User("Tali", 28, 123), "group3");
// tree.add(dana, "group3");
// tree.add(dana, "group1");
//
// tree.add(new Group (null, "group6"), "group5");
//
// //const group5path = tree.myPath("group1");
// var danai = tree.searchUnique("Dana");
// debugger;