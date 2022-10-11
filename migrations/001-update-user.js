module.exports = {
  up(db) {
    return db.collection('roles').insertMany([{ name: 'admin' }, { name: 'employee' }]);
  },
  down(db) {
    return db.collection('roles').deleteMany([{ name: 'admin' }, { name: 'employee' }]);
  },
};
