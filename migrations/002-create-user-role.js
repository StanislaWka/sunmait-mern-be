module.exports = {
  async up(db) {
    const adminRole = await db.collection('roles').findOne({ name: 'admin' });
    const employeeRole = await db.collection('roles').findOne({ name: 'employee' });
    await db
      .collection('users')
      .updateMany({ email: { $ne: 'admin@mail.ru' } }, { $set: { roleId: employeeRole._id } });
    return db
      .collection('users')
      .updateOne({ email: 'admin@mail.ru' }, { $set: { roleId: adminRole._id } });
  },
  down(db) {
    return db.collection('users').updateOne({ email: 'admin@mail.ru' }, { $unset: { roleId: '' } });
  },
};
